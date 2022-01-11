import {useDispatch, useSelector} from 'react-redux';
import {selectPatient} from '../../store/patients.selectors';
import {useTranslation} from 'react-i18next';
import withErrorLogging from '@shared/HOC/with-error-logging';
import {Controller, useForm} from 'react-hook-form';
import React from 'react';
import Select from '@components/select/select';
import {Option} from '@components/option/option';
import Radio from '@components/radio/radio';
import Button from '@components/button/button';
import {PatientUpdateModel} from '@pages/patients/models/patient-update-model';
import {useMutation, useQuery} from 'react-query';
import {QueryStates} from '@constants/react-query-constants';
import {getStates} from '@shared/services/lookups.service';
import {setStates} from '@shared/store/lookups/lookups.slice';
import {selectStates} from '@shared/store/lookups/lookups.selectors';
import {updatePatientContactInformation} from '@pages/patients/services/patients.service';
import {setPatient} from '@pages/patients/store/patients.slice';
import ControlledInput from '@components/controllers/ControlledInput';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';

export interface PatientInformationUpdateProps
{
    onUpdateComplete: () => void;
}

const PatientContactInfoUpdate = ({onUpdateComplete} : PatientInformationUpdateProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const patient = useSelector(selectPatient);
    const states = useSelector(selectStates);
    const requiredText = t('common.required');

    useQuery(QueryStates, () => getStates(),
        {
                onSuccess:(data: any)=> {
                    const managedStates = data.map((item: any) => {
                        return {
                            value: item.stateCode,
                            label: item.name
                        } as Option;
                    })
                    dispatch(setStates(managedStates));
                }
            }
        );

    const updatePatientContactInfoMutation = useMutation(updatePatientContactInformation, {
        onSuccess: (data) => {
            dispatch(setPatient(data))
            onUpdateComplete();
        },
    });

    const {handleSubmit, control, errors, watch,
        clearErrors,
        formState: { isDirty },} = useForm({
        mode: 'onBlur',
        defaultValues: {
            mobilePhone: patient.mobilePhone,
            address: patient.address,
            homePhone: patient.homePhone,
            address2: patient.address2,
            city: patient.city,
            contactPreference: patient.contactPreference,
            state: patient.state,
            zip: patient.zip,
            consentToText: patient.consentToText.toString(),
            email: patient.emailAddress?.toLowerCase()
        } as PatientUpdateModel
    });

    const watchMobilePhone = watch('mobilePhone');
    const watchHomePhone = watch('homePhone');
    const watchEmail = watch('email');
    const watchContactPreference: string = watch('contactPreference');

    const onSubmit = (values: PatientUpdateModel) => {
        updatePatientContactInfoMutation.mutate({patientId: patient.patientId, data: {
            ...values,
            email: values.email.toLowerCase()
            }}, {
            onSuccess: () => {
                dispatch(addSnackbarMessage({
                    type:SnackbarType.Success,
                    message: 'patient.summary.update_success'
                }));
            },
            onError: () => {
                dispatch(addSnackbarMessage(({
                    type: SnackbarType.Error,
                    message: 'patient.summary.update_error'
                })));
            }
        });
    }

    const getStatesOptions = () : Option[] => {
        return states && states.length > 0 ? [...states] : [];
    }

    const YesNoOptions: Option[] =
        [{
            value: 'true',
            label: t('common.yes')
        }, {
            value: 'false',
            label: t('common.no')
        }];

    const contactPreferenceOptions : Option[] = [
        {
            value:'MOBILEPHONE',
            label: 'patient.contact_preference.mobilephone',
            disabled: !(watchMobilePhone && watchMobilePhone.length > 0)
        },{
            value:'HOMEPHONE',
            label: 'patient.contact_preference.homephone',
            disabled: !(watchHomePhone && watchHomePhone.length > 0)
        },{
            value:'WORKPHONE',
            label: 'patient.contact_preference.workphone'
        },{
            value:'MAIL',
            label: 'patient.contact_preference.mail',
            disabled: !(watchEmail && watchEmail.length > 0)
        },{
            value:'PORTAL',
            label: 'patient.contact_preference.portal'
        }
    ];

    const contactPreferenceUpdated = (option: Option) => {
        if (option) {
            if (option.value === "MOBILEPHONE") {
                clearErrors('homePhone');
                clearErrors('email');
            } else if (option.value === "HOMEPHONE") {
                clearErrors('mobilePhone');
                clearErrors('email');
            }  else if (option.value === "MAIL") {
                clearErrors('mobilePhone');
                clearErrors('homePhone');
            } else {
                clearErrors('mobilePhone');
                clearErrors('homePhone');
                clearErrors('email');
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='grid grid-cols-1 lg:grid-cols-12'>
                    <div className='col-span-12 lg:col-span-5 pt-4'>
                        <ControlledInput
                            control={control}
                            name='address'
                            dataTestId='patient-update-address'
                            className='w-full'
                            label='patient.summary.address'
                        />
                    </div>
                    <div className='col-span-12 lg:col-span-5 lg:col-start-7 pt-4'>
                        <ControlledInput
                            control={control}
                            name='homePhone'
                            dataTestId='patient-update-home_phone'
                            required={watchContactPreference === 'HOMEPHONE'}
                            type='tel'
                            label='patient.summary.home_phone'
                            className='w-full'                            
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12'>
                    <div className='col-span-12 lg:col-span-5 pt-4'>
                        <ControlledInput
                            control={control}
                            name='address2'
                            dataTestId='patient-update-address2'
                            className='w-full'
                            label='patient.summary.apt_number'
                        />
                    </div>
                    <div className='col-span-12 lg:col-span-5 lg:col-start-7 pt-4'>
                        <ControlledInput
                            control={control}
                            name='mobilePhone'
                            dataTestId='patient-update-mobile_phone'
                            required={watchContactPreference === 'MOBILEPHONE'}
                            type='tel'
                            label='patient.summary.mobile_phone'
                            className='w-full'
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12'>
                    <div className='col-span-12 lg:col-span-5 pt-4'>
                        <ControlledInput
                            control={control}
                            name='city'
                            dataTestId='patient-update-city'
                            className='w-full'
                            label='patient.summary.city'
                        />
                    </div>
                    <div className='col-span-12 lg:col-span-5 lg:col-start-7 pt-4'>
                        <Controller
                            name='contactPreference'
                            control={control}
                            rules={{required: requiredText}}
                            defaultValue={contactPreferenceOptions.find(o => o.value === patient.contactPreference)}
                            render={(props) => (
                                <Select
                                    options={contactPreferenceOptions}
                                    label='patient.summary.contact_preference'
                                    {...props}
                                    data-test-id={'patient-update-contact_preference'}
                                    error={errors.contactPreference?.message}
                                    required={true}
                                    onSelect={(option?: Option)=>{
                                        if(option){
                                            props.onChange(option.value);
                                            contactPreferenceUpdated(option);
                                        }
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-12'>
                    <div className='col-span-12 lg:col-span-6 pt-4'>
                        <div className='grid grid-cols-1 lg:grid-cols-12'>
                            <div className='col-span-12 lg:col-span-5 pt-4'>
                                <Controller
                                    name='state'
                                    control={control}
                                    defaultValue={getStatesOptions()?.find(o => o.value === patient.state)}
                                    render={(props) => (
                                            <Select
                                                order={true}
                                                label='patient.summary.state'
                                                {...props}
                                                value={props.value}
                                                options={getStatesOptions()}                                                
                                                data-test-id={'patient-update-state'}
                                                error={errors.state?.message}
                                                onSelect={(option?: Option)=>{
                                                    if(option){
                                                        props.onChange(option.value);
                                                    }                                    
                                                }}
                                            />
                                    )}
                                />
                            </div>
                            <div className='col-span-12 lg:col-span-4 lg:col-start-7 pt-4'>
                                <ControlledInput
                                    control={control}
                                    name='zip'
                                    dataTestId='patient-update-zip-code'
                                    className='w-full'
                                    label='patient.summary.zip_code'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-span-12 lg:col-span-6 pt-4'>
                        <Controller
                            name='consentToText'
                            control={control}
                            render={(props) => (
                                <div>
                                    <div>
                                        {t('patient.summary.consent_to_text')}
                                    </div>
                                    <div className='pt-3'>
                                        <Radio
                                            name={props.name}
                                            truncate={true}
                                            ref={props.ref}
                                            data-test-id='consent-to-text'
                                            defaultValue={patient.consentToText.toString()}
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
                </div>


                <div className='grid grid-cols-1 lg:grid-cols-12'>
                    <div className='col-span-12 lg:col-span-5 pt-4'>
                        <ControlledInput
                            control={control}
                            name='email'
                            dataTestId='patient-update-email'
                            required={watchContactPreference === 'MAIL'}
                            className='w-full'
                            label='patient.summary.email'
                            type='email'
                        />
                    </div>
                </div>
                <div className='pt-4'>
                    <Button isLoading={updatePatientContactInfoMutation.isLoading} disabled={!isDirty} label={t('common.save')} buttonType='small' type='submit'/>
                </div>
            </form>
        </div>
    );
};

export default withErrorLogging(PatientContactInfoUpdate);
