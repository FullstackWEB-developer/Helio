import React from 'react';
import {ControlledDateInput, ControlledInput, ControlledSelect} from '@components/controllers';
import Radio from '@components/radio/radio';
import {Controller,  useForm} from 'react-hook-form';
import utils from '@shared/utils/utils';
import {Option} from '@components/option/option';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import {selectStates} from '@shared/store/lookups/lookups.selectors';
import {CreatePatientModel, CreatePatientRequest} from '@pages/external-access/models/create-patient-request.model';
import dayjs from 'dayjs';
import {useMutation} from 'react-query';
import {upsertPatient} from '@pages/patients/services/patients.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {setRegisteredPatient} from '@pages/external-access/registration/store/registration.slice';
import Button from '@components/button/button';
import {selectRegisteredPatient} from '@pages/external-access/registration/store/registration.selectors';
export interface PersonalInformationRegistrationStepProps {
    onPatientUpsert: () => void
}
const PersonalInformationRegistrationStep = ({onPatientUpsert}: PersonalInformationRegistrationStepProps) => {
    const dispatch = useDispatch();
    const patientData = useSelector(selectRegisteredPatient);
    const {t} = useTranslation();
    const states = useSelector(selectStates);
    const {control, formState: {errors, isValid, isDirty}, handleSubmit, watch, setError} = useForm({mode: 'onChange'});
    const displayDobErrorMessage = () => {
        if (errors.dob?.type) {
            switch (errors.dob?.type) {
                case "required":
                    return t('external_access.invalid_dob', {'format': utils.getBrowserDatePattern()});
                case "max":
                    return t('external_access.registration.max_age');
            }
        }
    }

    const genderOptions: Option[] = [
        {
            value: 'Female',
            label: 'external_access.registration.female'
        },
        {
            value: 'Male',
            label: 'external_access.registration.male'
        }
    ];

    const referralSourceLookupValues = useSelector((state) => selectLookupValues(state, 'ReferralSource'));
    const referralSourceItems: Option[] = referralSourceLookupValues.map(sourceItem => {
        return {
            value: sourceItem.value,
            label: `external_access.registration.${sourceItem.label}`
        }
    });

    const dobValue = watch('dob', '');
    if(utils.isValidDobByAthenaMaxAgeConstraint(dobValue) && !errors.dob){
        setError('dob', {type: 'max', message: 'external_access.registration.max_age'})
    }

    const createPatientMutation = useMutation(upsertPatient);

    const onSubmit = (formData: any) => {
        const departmentId = Number(utils.getAppParameter('DefaultDepartmentId')) ?? 3;
        const patient: CreatePatientModel = {
            address: formData.address,
            city: formData.city,
            departmentId,
            dateOfBirth: dayjs(formData.dob).format('MM/DD/YYYY'),
            ...(formData.email && {email: formData.email}),
            firstName: formData.firstName,
            lastName: formData.lastName,
            mobilePhone: formData.mobilePhone,
            sex: utils.isString(formData.gender) ? formData.gender.charAt(0) : formData.gender.value.charAt(0),
            zip: formData.zip,
            referralSourceId: formData.referralSource,
            contactPreference: formData.preferredCommunication,
            state: formData.state,
            address2: formData.address2
        };
        const createPatientRequest: CreatePatientRequest = {
            patient,
        };

        if (!!patientData?.registrationSessionKey) {
            createPatientRequest.registrationSessionKey = patientData.registrationSessionKey;
        }

        createPatientMutation.mutate(createPatientRequest, {
            onSuccess: (data) => {
                createPatientRequest.registrationSessionKey = data.registrationSessionKey;
                createPatientRequest.patient.patientId = data.patientId;
                dispatch(setRegisteredPatient(createPatientRequest));
                onPatientUpsert();
            },
            onError: (error: any) => {
                dispatch(addSnackbarMessage({
                    type: SnackbarType.Error,
                    message: error?.response?.data.message ?? 'external_access.registration.patient_creation_failure'
                }));
            }
        });
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col w-full'>
            <div className='flex flex-col md:flex-row md:gap-8'>
                <ControlledInput
                    name='firstName'
                    control={control}
                    label='external_access.first_name'
                    defaultValue=''
                    required={true}
                    containerClassName='md:w-1/2' />
                <ControlledInput
                    name='lastName'
                    control={control}
                    label='external_access.last_name'
                    defaultValue=''
                    required={true} containerClassName='md:w-1/2' />
            </div>
            <div className='flex flex-col md:flex-row md:gap-8 md:w-full'>
                <ControlledInput
                    type='date'
                    containerClassName='md:w-1/2'
                    required={true}
                    errorMessage={errors?.dob && displayDobErrorMessage()}
                    label='external_access.registration.dob'
                    assistiveText={utils.getBrowserDatePattern()}
                    control={control}
                    name='dob'
                    className='w-full'
                />
                <ControlledInput
                    name='email'
                    type='email'
                    control={control}
                    label='external_access.registration.email'
                    defaultValue=''
                    required={false}
                    containerClassName='md:w-1/2' />
            </div>
            <div className='flex flex-col md:flex-row md:gap-8'>
                <ControlledInput
                    type='tel'
                    required={true}
                    defaultValue=''
                    containerClassName='md:w-1/2'
                    label='external_access.registration.mobile_phone'
                    control={control}
                    name='mobilePhone' />

                <Controller
                    name='gender'
                    control={control}
                    defaultValue={genderOptions[0]}
                    render={(props) => (
                        <div>
                            <div className='body2'>
                                {t('external_access.registration.gender')}
                            </div>
                            <div className='pt-3'>
                                <Radio
                                    defaultValue={genderOptions[0].value}
                                    name={props.name}
                                    truncate={true}
                                    ref={props.ref}
                                    data-test-id='consent-to-text'
                                    className='flex flex-row space-x-8'
                                    items={genderOptions}
                                    onChange={(e: string) => {
                                        props.onChange(e);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                />
            </div>
            <div className='flex flex-col md:flex-row md:gap-8'>
                <ControlledInput
                    control={control}
                    name='zip'
                    required={true}
                    type='zip'
                    containerClassName='md:w-1/2'
                    defaultValue=''
                    label='external_access.registration.zip'
                />
                <ControlledInput
                    name='city'
                    control={control}
                    label='external_access.registration.city'
                    defaultValue=''
                    required={true}
                    containerClassName='md:w-1/2' />
            </div>
            <div className='flex flex-col md:flex-row md:gap-8'>
                <ControlledInput
                    name='address'
                    control={control}
                    label='external_access.registration.address'
                    defaultValue=''
                    required={true}
                    containerClassName='md:w-1/2' />
                <ControlledInput
                    name='address2'
                    control={control}
                    label='external_access.registration.apt'
                    defaultValue=''
                    required={false}
                    containerClassName='md:w-1/2' />
            </div>
            <div className='flex flex-col md:flex-row md:gap-8 md:w-1/2'>
                <ControlledSelect
                    name='state'
                    control={control}
                    label='external_access.registration.state'
                    defaultValue=''
                    required={true}
                    options={states || []}
                    autoComplete={false} />
            </div>

            <div className='flex flex-col'>
                <div className='body2'>{t('external_access.registration.referral_source')}</div>
                <ControlledSelect
                    required={true}
                    name='referralSource'
                    label='external_access.registration.source'
                    className='md:w-1/2'
                    options={referralSourceItems}
                    defaultValue=''
                    control={control}
                    autoComplete={false}
                />
            </div>
            <Button label='common.continue' buttonType='big' className='mr-8 w-36 pt-6'
                    isLoading={createPatientMutation.isLoading}
                    disabled={!isValid || !isDirty} type='submit' />
        </form>
    );
}

export default PersonalInformationRegistrationStep;
