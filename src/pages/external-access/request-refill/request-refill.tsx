import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientsMedications, requestRefill } from './services/request-refill.service';
import {
    selectIsMedicationsLoading,
    selectIsRequestRefillLoading,
    selectMedications,
    SelectIsRequestRefillRequestCompleted,
    SelectRequestRefillError
} from './store/request-refill.selectors';
import Select from '../../../shared/components/select/select';
import { Option } from '@components/option/option';
import Input from '../../../shared/components/input/input';
import Button from '../../../shared/components/button/button';
import { useForm, Controller } from 'react-hook-form';
import ThreeDots from '../../../shared/components/skeleton-loader/skeleton-loader';
import { selectDepartmentList, selectProviderList } from '../../../shared/store/lookups/lookups.selectors';
import { getDepartments, getProviders } from '../../../shared/services/lookups.service';
import { Provider } from '../../../shared/models/provider';
import { Department } from '../../../shared/models/department';
import { selectVerifiedPatent } from '../../patients/store/patients.selectors';
import { clearRequestRefillState } from './store/request-refill.slice';
import { clearVerifiedPatient } from '../../patients/store/patients.slice';
import withErrorLogging from '../../../shared/HOC/with-error-logging';

const RequestRefill = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const medications = useSelector(selectMedications);
    const departments = useSelector(selectDepartmentList);
    const providers = useSelector(selectProviderList);
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const isMedicationsLoading = useSelector(selectIsMedicationsLoading);
    const isRequestRefillLoading = useSelector(selectIsRequestRefillLoading);
    const requestRefillError = useSelector(SelectRequestRefillError);
    const isRequestRefillRequestCompleted = useSelector(SelectIsRequestRefillRequestCompleted);
    const onSubmit = async (data: any) => {
        const providerId: string = data.providerId.value;
        const departmentId: string = data.departmentId.value;
        const note = `Medication : ${data.medication.label}, Patient Note : ${data.note}`;
        dispatch(requestRefill(verifiedPatient.patientId.toString(), departmentId, providerId, note));
    }

    const { handleSubmit, control, errors } = useForm();

    useEffect(() => {
        if (verifiedPatient) {
            dispatch(getPatientsMedications(verifiedPatient.patientId.toString(), verifiedPatient?.departmentId));
            dispatch(getDepartments());
            dispatch(getProviders());
        }
        return () => {
            dispatch(clearRequestRefillState());
            dispatch(clearVerifiedPatient());
        }
    }, [dispatch, verifiedPatient]);

    const medicationOptions: Option[] = medications?.map(item => {
        return {
            value: item.medicationName,
            label: item.medicationName
        };
    });

    const departmentOptions: Option[] = departments !== undefined ? departments?.map((item: Department) => {
        return {
            value: item.id.toString(),
            label: item.name
        };
    }) : [];

    const providerOptions: Option[] = providers !== undefined ? providers?.map((item: Provider) => {
        return {
            value: item.id.toString(),
            label: item.displayName
        };
    }) : [];


    if (isMedicationsLoading || isRequestRefillLoading) {
        return <ThreeDots data-test-id='request-refill-loading' />;
    }
    if (!verifiedPatient) {
        return <div>{t('hipaa_validation_form.hipaa_verification_failed')}</div>;
    }

    if (medicationOptions && medicationOptions.length < 1) {
        return <div data-test-id='request-refill-no-medication-found'>{t('request-refill.no_medication_found')}</div>
    }
    if (providers === undefined || departments === undefined) {
        return <div data-test-id='request-refill-provider-or-departments-failed'>{t('request-refill.provider_department_load_failed')}</div>
    }

    if (isRequestRefillRequestCompleted) {
        return <div data-test-id='request-refill-completed'>{t('request-refill.completed')}</div>
    }
    if (requestRefillError) {
        return <div data-test-id='request-refill-error'>{t('request-refill.error')}</div>
    }
    return <div className={'w-96 py-4 mx-auto flex flex-col'}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name='medication'
                control={control}
                defaultValue={medicationOptions ? medicationOptions[0] : ''}
                rules={{ required: true }}
                as={Select}
                options={medicationOptions}
                data-test-id='request-refill-medication'
                label={'request-refill.medication_to_refill'}
            />
            <Controller
                name='providerId'
                control={control}
                rules={{ required: true }}
                as={Select}
                defaultValue={providerOptions[0]}
                options={providerOptions}
                data-test-id='request-refill-provider'
                label={'request-refill.provider'}
            />
            <Controller
                name='departmentId'
                control={control}
                rules={{ required: true }}
                defaultValue={departmentOptions[0]}
                as={Select}
                options={departmentOptions}
                data-test-id='request-refill-department'
                label={'request-refill.location'}
            />
            <Controller
                name='note'
                control={control}
                defaultValue={''}
                rules={{ required: 'Required' }}
                as={Input}
                error={errors.note?.message}
                className={'pb-4'}
                label={'request-refill.notes'}
                data-test-id='request-refill-notes'
            />
            <div className={'flex justify-center pt-2'}>
                <Button data-test-id='request-refill-ok-button' type={'submit'} label={'common.ok'} />
            </div>
        </form>
    </div>
}

export default withErrorLogging(RequestRefill);
