import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import SvgIcon from '@components/svg-icon/svg-icon';
import { Icon } from '@components/svg-icon/icon';
import {
    PatientCaseDocumentSource,
    PatientCaseDocumentSubClass
} from '@pages/external-access/request-refill/models/patient-case-external.model';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { selectVerifiedPatent } from '@pages/patients/store/patients.selectors';
import { useMutation, useQuery } from 'react-query';
import {
    createPatientCase,
    getPatientDefaultPharmacy,
    getPatientMedications,
    searchPharmacies
} from '@pages/external-access/request-refill/services/request-refill.service';
import ControlledSelect from '@components/controllers/controlled-select';
import { Option } from '@components/option/option';
import { Medication } from '@pages/external-access/request-refill/models/medication.model';
import { AxiosError } from 'axios';
import {
    QueryDefaultPharmacy,
    QueryPatientMedication,
    QueryPharmacies,
    QueryStates
} from '@constants/react-query-constants';
import { ViewMedicationsPath} from '@app/paths';
import { Pharmacy } from '@pages/external-access/request-refill/models/pharmacy.model';
import TextArea from '@components/textarea/textarea';
import Button from '@components/button/button';
import { useHistory } from 'react-router-dom';
import utils from '@shared/utils/utils';
import './request-refill.scss';
import ControlledInput from '@components/controllers/ControlledInput';
import { selectProviderList } from '@shared/store/lookups/lookups.selectors';
import { Provider } from '@shared/models/provider';
import { getProviders, getStates } from '@shared/services/lookups.service';
import { selectMedication } from '@pages/external-access/request-refill/store/request-refill.selectors';
import useDebounce from '@shared/hooks/useDebounce';
import { DEBOUNCE_SEARCH_DELAY_MS } from '@constants/form-constants';
import { Facility } from '@pages/external-access/request-refill/models/facility.model';
import Spinner from '@components/spinner/Spinner';
import Checkbox, { CheckboxCheckEvent } from '@components/checkbox/checkbox';
import { addRefillRequestedMedication } from './store/request-refill.slice';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';

const RequestRefill = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const mask = '(999) 999-9999';
    const history = useHistory();
    const providers = useSelector(selectProviderList);
    const medication = useSelector(selectMedication);
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const [isVisibleForm, setIsVisibleForm] = useState(false);
    const { handleSubmit, control, errors, setError, setValue, getValues, watch } = useForm();
    const [messageText, setMessageText] = useState('');
    const maxLength = 1000;
    const [pharmaciesSearchTerm, setPharmaciesSearchTerm] = useState('');
    const [debouncePharmaciesSearchTerm] = useDebounce(pharmaciesSearchTerm, DEBOUNCE_SEARCH_DELAY_MS);
    const [pharmacyOptions, setPharmacyOptions] = useState<Option[]>([]);
    const [defaultPharmacy, setDefaultPharmacy] = useState<Pharmacy>();
    const [selectedPharmacy, setSelectedPharmacy] = useState<Facility>();
    const [stateOptions, setStateOptions] = useState<Option[]>([]);
    const [isReadonlyPharmacy, setIsReadonlyPharmacy] = useState(true);
    const [formReady, setFormReady] = useState(false);
    const pharmacyName = watch('pharmacyName');
    useEffect(() => {
        dispatch(getProviders());
    }, [dispatch]);

    const { isLoading: isMedicationLoading, data: medications, isFetched } = useQuery<Medication[], AxiosError>([QueryPatientMedication, verifiedPatient?.patientId], () =>
        getPatientMedications(verifiedPatient?.patientId),
        {
            enabled: !!verifiedPatient
        }
    );

    const { isLoading: isDefaultPharmacyLoading } = useQuery<Pharmacy, AxiosError>([QueryDefaultPharmacy, verifiedPatient?.patientId, verifiedPatient?.departmentId], () =>
        getPatientDefaultPharmacy(verifiedPatient?.patientId),
        {
            enabled: !!verifiedPatient,
            onSuccess: (data) => {
                setDefaultPharmacy(data);
            },
            onError: (error) => {
                setIsVisibleForm(true);
            }
        }
    );

    const { refetch: refetchPharmacies, isFetching: isFetchingPharmacies } = useQuery<Facility[], AxiosError>([QueryPharmacies, debouncePharmaciesSearchTerm], () =>
        searchPharmacies(verifiedPatient?.patientId, verifiedPatient?.departmentId, debouncePharmaciesSearchTerm), {
        enabled: false,
        onSuccess: (data) => {
            const pharmacyOptionsResult = data !== undefined ? data?.map((item: Facility) => {
                return {
                    value: item.facilityId.toString(),
                    label: item.name,
                    object: item
                };
            }) : [] as Option[];
            if (pharmacyOptionsResult.length > 0) {
                setPharmacyOptions(pharmacyOptionsResult);
                setIsReadonlyPharmacy(true);
            } else {
                setSelectedPharmacy({} as Facility);
                setIsReadonlyPharmacy(false);
                setTimeout(() => {
                    setValue('pharmacyName', debouncePharmaciesSearchTerm);
                }, 300)
            }
        },
        onError: () => {
            setError('pharmacyName', { type: 'notFound', message: t('external_access.medication_refill.error_getting_pharmacies') });
        }
    });

    const { isLoading: isStatesLoading } = useQuery(QueryStates, () =>
        getStates(),
        {
            onSuccess: (data: any) => {
                const managedStates = data.map((item: any) => {
                    return {
                        value: item.stateCode,
                        label: item.name
                    } as Option;
                })
                setStateOptions(managedStates);
            }
        }
    );

    useEffect(() => {
        if (debouncePharmaciesSearchTerm && debouncePharmaciesSearchTerm.length > 2) {
            refetchPharmacies();
        } else {
            setPharmacyOptions([]);
        }
    }, [debouncePharmaciesSearchTerm, refetchPharmacies]);

    const medicationOptions: Option[] = medications !== undefined ? medications?.filter(m => m.refillsAllowed)?.map(item => {
        return {

            value: item.medicationName,
            label: item.medicationName,
            object: item
        };
    }) : [];

    const providerOptions: Option[] = providers !== undefined ? providers?.map((item: Provider) => {
        return {
            value: item.id.toString(),
            label: item.displayName
        };
    }) : [];

    useEffect(() => {
        if (isFetched && providerOptions.length && !formReady) {
            setFormReady(true);
        }
    }, [isFetched, providerOptions, formReady])

    const defaultMedication = medicationOptions?.find(m => m.value === medication?.medicationName)?.value;

    const determineDefaultProvider = () => {
        const medicationProvider = determineProviderForMedication();
        if (medicationProvider) {
            return medicationProvider;
        }
        return providerOptions.find(p => p.value === verifiedPatient?.defaultProviderId?.toString())?.value;
    }

    const determineProviderForMedication = () => {
        const compareMedication = getValues('medication') ?? medication?.medicationName;
        const chosenMedication = medicationOptions?.find(m => m.value === compareMedication);
        if (chosenMedication && chosenMedication.object?.defaultProviderId && chosenMedication.object?.enteredBy) {
            const provider = providerOptions.find(p => p.value === chosenMedication.object.defaultProviderId.toString());
            if (provider) {
                return provider.value;
            }
        }
        return null;
    }

    const defaultProvider = determineDefaultProvider();

    const handleMedicationSelect = (option?: Option) => {
        if (option) {
            setValue('providerId', determineDefaultProvider())
        }
    }

    const onUseDifferentPharmacyCheckChange = (event: CheckboxCheckEvent) => {
        setIsVisibleForm(event.checked);
        if (!event.checked) {
            return;
        }
    }

    const onPharmacySelectChange = (option?: Option) => {
        if (option) {
            const pharmacy = option.object;
            setIsReadonlyPharmacy(true);
            setSelectedPharmacy(pharmacy);
            setValue('pharmacyAddress', pharmacy.address);
            setValue('pharmacyCity', pharmacy.city);
            if (pharmacy.state) {
                const selectedState = stateOptions.find(s => s.value === pharmacy.state);
                setValue('pharmacyState', selectedState);
            }
            setValue('pharmacyZip', pharmacy.zipCode);
            setValue('pharmacyPhone', pharmacy.phoneNumber);
            setValue('pharmacyFax', pharmacy.faxNumber);
        } else {
            setIsReadonlyPharmacy(false);
        }
    }

    const onPharmacyInputChange = (value: string) => {
        if (!value.trim()) {
            setIsReadonlyPharmacy(true);
        }
    }

    const { isLoading, isError, mutate } = useMutation(createPatientCase, {
        onSuccess: () => {
            setMessageText('');
            history.push('/o/request-refill-confirmation');
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'external_access.message_send_failed'
            }))
        }
    });

    const getMarginBottom = () => {
        return (isLoading || isError) ? ' mb-1.5' : ' mb-10'
    }

    const getMessageText = () => {
        if (messageText.length > maxLength) {
            return messageText.slice(maxLength);
        }
        return messageText;
    }

    const getSuite = (suite: string | undefined) => {
        return suite ? `${suite}, ` : '';
    }

    const UseThisPharmacy = (): Pharmacy => {
        let pharmacy: Pharmacy;
        if (selectedPharmacy?.name !== undefined) {
            pharmacy = {
                pharmacyType: selectedPharmacy.pharmacyType,
                state: selectedPharmacy.state,
                city: selectedPharmacy.city,
                clinicalProviderId: selectedPharmacy.facilityId,
                zip: selectedPharmacy.zipCode,
                phoneNumber: utils.clearFormatPhone(selectedPharmacy.phoneNumber),
                clinicalProviderName: selectedPharmacy.name,
                address1: selectedPharmacy.address,
                faxNumber: utils.clearFormatPhone(selectedPharmacy.faxNumber)
            }
            setDefaultPharmacy(pharmacy);
        } else {
            pharmacy = {
                suite: getValues('pharmacySuite'),
                state: getValues('pharmacyState'),
                city: getValues('pharmacyCity'),
                clinicalProviderId: getValues('providerId').value,
                zip: getValues('pharmacyZip'),
                phoneNumber: utils.clearFormatPhone(getValues('pharmacyPhone')),
                clinicalProviderName: getValues('pharmacyName'),
                address1: getValues('pharmacyAddress'),
                faxNumber: utils.clearFormatPhone(getValues('pharmacyFax'))
            }
            setDefaultPharmacy(pharmacy);
        }
        setIsVisibleForm(false);
        return pharmacy;
    }

    const onSubmit = (data: any) => {

        let pharmacy = isVisibleForm ? UseThisPharmacy() : defaultPharmacy;
        let internalNote = `"** Prescription `;
        internalNote += `${data.medication} `;
        if (pharmacy) {
            internalNote += `**  Pharmacy Information `;
            internalNote += `${pharmacy?.clinicalProviderName} `;
            internalNote += `${getSuite(pharmacy.suite)} ${pharmacy.address1}, ${pharmacy.city} `;
            internalNote += `${t('external_access.medication_refill.pharmacy_information_ph')} ${utils.formatPhone(pharmacy.phoneNumber)}, `;
            internalNote += `${t('external_access.medication_refill.pharmacy_information_fax')} ${utils.formatPhone(pharmacy.faxNumber)} `;
        }
        internalNote += `** Patient Note: ${getMessageText()}" `;
        internalNote += `ProviderId: ${verifiedPatient.defaultProviderId}`;

        mutate({
            patientId: verifiedPatient.patientId,
            patientCaseExternal: {
                departmentId: verifiedPatient.defaultDepartmentId,
                providerId: data.providerId,
                internalNote: internalNote,
                ignoreNotification: false,
                documentSubClass: PatientCaseDocumentSubClass.Refill,
                documentSource: PatientCaseDocumentSource.Patient
            }
        }, {
            onSuccess: () => {
                dispatch(addRefillRequestedMedication(data.medication));
            }
        });
    }

    if (isMedicationLoading || isDefaultPharmacyLoading || isStatesLoading || !formReady) {
        return <Spinner fullScreen />
    }

    if (!verifiedPatient) {
        return <div>{t('hipaa_validation_form.hipaa_verification_failed')}</div>;
    }

    if (medicationOptions && medicationOptions.length < 1) {
        return <div data-test-id='request-refill-no-medication-found'>{t('request-refill.no_medication_found')}</div>
    }

    const getPharmacyNameSelect = () => {
        return <ControlledSelect
            name='pharmacyName'
            data-test-id='request-refill-pharmacy-name'
            control={control}
            required={true}
            label={'external_access.medication_refill.pharmacy_name'}
            options={pharmacyOptions}
            onTextChange={(value: string) => setPharmaciesSearchTerm(value || '')}
            onSelect={(option) => onPharmacySelectChange(option)}
            isLoading={isFetchingPharmacies}
        />;
    }

    const getPharmacyNameInput = () => {
        return <ControlledInput control={control} name='pharmacyName' required={true}
            label={'external_access.medication_refill.pharmacy_name'}
            data-test-id='request-refill-pharmacy-name'
            onChange={({ target }) => onPharmacyInputChange(target.value)}
        />;
    }

    const getPharmacyNameControl = () => {
        return isReadonlyPharmacy ? getPharmacyNameSelect() : getPharmacyNameInput();
    }

    if (!verifiedPatient) {
        return <div>{t('external_access.not_verified_patient')}</div>
    }

    const isDisabled = () => {
        if (isLoading) {
            return true;
        }
        if (!!defaultPharmacy || (isVisibleForm && !!pharmacyName)) {
            return false;
        }

        return true;
    }

    return <div className='2xl:px-48 pt-7 without-default-padding'>
        <div className='flex flex-row pb-5 cursor-pointer' onClick={() => history.push(ViewMedicationsPath)}>
            <SvgIcon type={Icon.ArrowBack} />
            <div className='body2 pl-4'>
                {t('external_access.medication_refill.back_to_medications')}
            </div>
        </div>
        <div className='2xl:whitespace-pre 2xl:h-12 flex w-full items-center'>
            <h4>
                {t('external_access.medication_refill.refill_request')}
            </h4>
        </div>
        <div className='pt-8 pb-10'>
            {t('external_access.medication_refill.refill_request_send_message')}
            <br />
            {t('external_access.medication_refill.refill_request_send_message_note')}
        </div>
        <div className='pt-2 request-refill-form'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='max-w-md'>
                    <ControlledSelect
                        name='medication'
                        control={control}
                        defaultValue={defaultMedication}
                        options={medicationOptions}
                        required={true}
                        data-test-id='request-refill-medication'
                        label={'external_access.medication_refill.select_prescription'}
                        onSelect={handleMedicationSelect}
                    />
                    <ControlledSelect
                        name='providerId'
                        control={control}
                        defaultValue={defaultProvider}
                        required={true}
                        options={providerOptions}
                        data-test-id='request-refill-provider'
                        label={'external_access.medication_refill.select_provider'}
                    />
                </div>
                <Controller
                    name='messageText'
                    control={control}
                    defaultValue={''}
                    render={() => (
                        <TextArea
                            error={errors.messageText?.message}
                            className='pl-4 pt-2 pb-11 pr-8 body2 w-full h-full rounded'
                            data-test-id='send-us-message-text'
                            placeHolder={t('common.enter_message')}
                            required={false}
                            rows={2}
                            resizable={false}
                            value={messageText}
                            isLoading={isLoading}
                            hasBorder={true}
                            maxLength={maxLength}
                            onChange={(message) => setMessageText(message)}
                            iconClassNames='icon-medium'
                            iconOnClick={() => {
                                handleSubmit(onSubmit)()
                            }}
                        />
                    )}
                />
                <div className='border mt-7 pb-0.5 rounded'>
                    <div className='p-6'>
                        <div className='flex justify-between'>
                            <div className='subtitle pb-4.5'>
                                {t('external_access.medication_refill.pharmacy_information')}
                            </div>
                        </div>

                        {!defaultPharmacy && <div className='body2 text-danger'>{t('external_access.medication_refill.pharmacy_missing')}</div>}
                        {defaultPharmacy && <Fragment>
                            <div className='subtitle2'>
                                {defaultPharmacy.clinicalProviderName}
                            </div>
                            <div className='body2'>
                                {`${getSuite(defaultPharmacy.suite)}${defaultPharmacy.address1}, ${defaultPharmacy.city}`} <br />
                                {`${t('external_access.medication_refill.pharmacy_information_ph')} ${utils.formatPhone(defaultPharmacy.phoneNumber)}, 
                          ${t('external_access.medication_refill.pharmacy_information_fax')} ${utils.formatPhone(defaultPharmacy.faxNumber)}`}
                            </div>
                        </Fragment>}
                    </div>
                </div>
                <div className='pt-6'>
                    <Checkbox name='use-different-pharmacy' checked={isVisibleForm} label={t('external_access.medication_refill.use_different_pharmacy')} onChange={onUseDifferentPharmacyCheckChange} />
                    {isVisibleForm && <div className='request-refill-fields'>
                        {
                            getPharmacyNameControl()
                        }
                        <ControlledInput name='pharmacyAddress' control={control} required={true} disabled={isReadonlyPharmacy}
                            label={t('external_access.medication_refill.pharmacy_address')}
                            dataTestId='request-refill-pharmacy-address'
                        />
                        <ControlledInput name='pharmacySuite' control={control} disabled={isReadonlyPharmacy}
                            label={t('external_access.medication_refill.pharmacy_suite')}
                            dataTestId='request-refill-pharmacy-suite'
                        />
                        <ControlledInput name='pharmacyCity' control={control} required={true} disabled={isReadonlyPharmacy}
                            label={t('external_access.medication_refill.pharmacy_city')}
                            dataTestId='request-refill-pharmacy-city'
                        />
                        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
                            <div className="col-span-12 lg:col-span-6">
                                <ControlledSelect
                                    name='pharmacyState'
                                    control={control}
                                    data-test-id='request-refill-pharmacy-state'
                                    label={'external_access.medication_refill.pharmacy_state'}
                                    options={stateOptions}
                                    required={true}
                                    disabled={isReadonlyPharmacy}
                                />
                            </div>
                            <div className="col-span-12 lg:col-span-6">
                                <ControlledInput name='pharmacyZip' control={control} required={true} disabled={isReadonlyPharmacy}
                                    label={t('external_access.medication_refill.pharmacy_zip')}
                                    dataTestId='request-refill-pharmacy-zip'
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8">
                            <div className="col-span-12 lg:col-span-6">
                                <ControlledInput name='pharmacyPhone' control={control} type='tel' mask={mask} disabled={isReadonlyPharmacy}
                                    label={t('external_access.medication_refill.pharmacy_phone')}
                                    dataTestId='request-refill-pharmacy-phone'
                                />
                            </div>
                            <div className="col-span-12 lg:col-span-6">
                                <ControlledInput name='pharmacyFax' control={control} type='tel' mask={mask} disabled={isReadonlyPharmacy}
                                    label={t('external_access.medication_refill.pharmacy_fax')}
                                    dataTestId='request-refill-pharmacy-fax'
                                />
                            </div>
                        </div>
                    </div>}
                </div>
                <div className={`flex justify-start items-center full-w mt-8 ${getMarginBottom()}`}>
                    <Button type='submit' isLoading={isLoading} buttonType='big' label={t('common.send')} disabled={isDisabled()} />
                </div>
            </form>
        </div>

    </div>
}

export default withErrorLogging(RequestRefill);
