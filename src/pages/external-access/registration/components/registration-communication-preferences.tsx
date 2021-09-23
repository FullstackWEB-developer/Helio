import Radio from '@components/radio/radio';
import React from 'react';
import {Control, Controller, FieldValues} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Option} from '@components/option/option';
import {ControlledSelect} from '@components/controllers';

const CommunicationPreferencesRegistrationStep = ({control}: {control: Control<FieldValues>}) => {

    const {t} = useTranslation();

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

    return (
        <>
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
        </>
    );
}

export default CommunicationPreferencesRegistrationStep;