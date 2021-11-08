import React from 'react';
import {ControlledDateInput, ControlledInput, ControlledSelect} from '@components/controllers';
import Radio from '@components/radio/radio';
import {Control, Controller, DeepMap, FieldError, FieldValues} from 'react-hook-form';
import utils from '@shared/utils/utils';
import {Option} from '@components/option/option';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {selectLookupValues} from '@pages/tickets/store/tickets.selectors';

const PersonalInformationRegistrationStep = ({control, errors}: {control: Control<FieldValues>, errors: DeepMap<FieldValues, FieldError>}) => {

    const {t} = useTranslation();
    const displayDobErrorMessage = () => {
        if (errors.dob?.type) {
            switch (errors.dob?.type) {
                case "required":
                    return t('external_access.invalid_dob', {'format': utils.getBrowserDatePattern()});
                case "min":
                    return t('external_access.registration.minor_dob');
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

    return (
        <>
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
            <div className='flex flex-col md:flex-row md:gap-8'>
                <ControlledDateInput
                    type='date'
                    longDateFormat={false}
                    isCalendarDisabled
                    required={true}
                    errorMessage={errors?.dob && displayDobErrorMessage()}
                    label='external_access.registration.dob'
                    assistiveText={utils.getBrowserDatePattern()}
                    control={control}
                    name='dob'
                    className='md:w-1/2'
                    max={new Date()}
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
                    name='apt'
                    control={control}
                    label='external_access.registration.apt'
                    defaultValue=''
                    required={false}
                    containerClassName='md:w-1/2' />
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
                />
            </div>
        </>
    );
}

export default PersonalInformationRegistrationStep;