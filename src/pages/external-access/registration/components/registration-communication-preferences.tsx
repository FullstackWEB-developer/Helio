import Radio from '@components/radio/radio';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Option} from '@components/option/option';
import {ControlledSelect} from '@components/controllers';
import {useDispatch, useSelector} from 'react-redux';
import {selectRegisteredPatient} from '@pages/external-access/registration/store/registration.selectors';
import {useMutation} from 'react-query';
import {upsertPatient} from '@pages/patients/services/patients.service';
import {CreatePatientRequest} from '@pages/external-access/models/create-patient-request.model';
import utils from '@shared/utils/utils';
import Button from '@components/button/button';
import {setRegisteredPatient} from '@pages/external-access/registration/store/registration.slice';

export interface CommunicationPreferencesRegistrationStepProps {
    onPatientUpdate: () => void;
    goBack: () => void;
}

const CommunicationPreferencesRegistrationStep = ({onPatientUpdate, goBack}: CommunicationPreferencesRegistrationStepProps) => {
    const patientData = useSelector(selectRegisteredPatient);
    const {t} = useTranslation();
    const {control, formState: {isValid, isDirty}, handleSubmit} = useForm({mode: 'onChange'});
    const dispatch = useDispatch();
    const YesNoOptions: Option[] = [
        {
            value: 'true',
            label: 'common.yes'
        },
        {
            value: 'false',
            label: 'common.no'
        }
    ];

    const contactPreferenceOptions: Option[] = [
        {
            value: 'MOBILEPHONE',
            label: 'patient.contact_preference.mobilephone',
        },
        {
            value: 'MAIL',
            label: 'patient.contact_preference.mail'
        }
    ];

    const updatePatientMutation = useMutation(upsertPatient);

    const onSubmit = (formData: any) => {
        if (!patientData) {
            return;
        }
        const createPatientRequest: CreatePatientRequest = {
            patient: {
                ...patientData.patient,
                consentToCall: utils.isString(formData.callConsent) ? formData.callConsent === 'true' : formData.callConsent.value === 'true',
                consentToText: utils.isString(formData.textConsent) ? formData.textConsent === 'true' : formData.textConsent.value === 'true',
                contactPreference: formData.preferredCommunication
            },
            registrationSessionKey: patientData.registrationSessionKey
        }
        updatePatientMutation.mutate(createPatientRequest, {
            onSuccess: () => {
                onPatientUpdate();
                dispatch(setRegisteredPatient(createPatientRequest));
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col md:flex-row md:gap-8'>
                <Controller
                    name='textConsent'
                    control={control}
                    defaultValue={YesNoOptions[0]}
                    render={(props) => (
                        <div>
                            <div className='body2'>
                                {t('external_access.registration.text_consent')}
                            </div>
                            <div className='pt-3'>
                                <Radio
                                    defaultValue={YesNoOptions[0].value}
                                    name={props.name}
                                    truncate={true}
                                    ref={props.ref}
                                    className='flex flex-row space-x-8'
                                    items={YesNoOptions}
                                    onChange={(e: string) => {
                                        props.onChange(e);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                />
            </div>

            <div className='flex flex-col md:flex-row md:gap-8 pt-7'>
                <Controller
                    name='callConsent'
                    control={control}
                    defaultValue={YesNoOptions[0]}
                    render={(props) => (
                        <div>
                            <div className='body2'>
                                {t('external_access.registration.call_consent')}
                            </div>
                            <div className='pt-3'>
                                <Radio
                                    defaultValue={YesNoOptions[0].value}
                                    name={props.name}
                                    truncate={true}
                                    ref={props.ref}
                                    className='flex flex-row space-x-8'
                                    items={YesNoOptions}
                                    onChange={(e: string) => {
                                        props.onChange(e);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                />
            </div>

            <div className='flex flex-col pt-7 pb-3'>
                <div className='body2'>{t('external_access.registration.preferred_communication')}</div>
                <ControlledSelect
                    required={true}
                    name='preferredCommunication'
                    label='external_access.registration.communication_method'
                    className='md:w-1/2'
                    options={contactPreferenceOptions}
                    defaultValue=''
                    control={control}
                />
            </div>
            <div className='flex pt-6'>
                <Button label='common.back' buttonType='secondary-big' className='mr-8 w-36' onClick={() => goBack()} />
                <Button type='submit' label='common.continue'
                        disabled={!isValid || !isDirty || updatePatientMutation.isLoading}
                        isLoading={updatePatientMutation.isLoading} className='w-36' />
            </div>
        </form>
    );
}

export default CommunicationPreferencesRegistrationStep;
