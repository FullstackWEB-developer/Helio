import utils from '@shared/utils/utils';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Option} from '@components/option/option';

const RegistrationReviewStep = ({getValues, insuranceOption}: {getValues: any, insuranceOption: Option | undefined}) => {

    const {t} = useTranslation();

    const displayAddressField = () => {
        const city = getValues('city');
        const address = getValues('address');
        const zip = getValues('zip');
        const apt = getValues('apt');
        let addressField = `${address}, ${city}, ${zip}`;
        if (apt) {
            addressField = `${apt}, ${addressField}`;
        }
        return addressField;
    }

    const displayGender = () => {
        const gender = getValues('gender');
        return utils.isString(gender) ? gender : gender?.value;
    }

    const displayConsents = (method: 'call' | 'text') => {
        const consent = getValues(`${method}Consent`);
        return utils.isString(consent) ? (consent === 'true' ? t('common.yes') : t('common.no')) : t(`${consent?.label}`);
    }

    const displayPreferredCommunication = (value: string) => {
        switch (value) {
            case 'MOBILEPHONE':
                return 'patient.contact_preference.mobilephone';
            case 'MAIL':
                return 'patient.contact_preference.mail';
        }
    }

    const displayReferralSource = (value: string) => {
        return `external_access.registration.referral_sources.${value}`;
    }

    return (
        <div className='flex flex-col'>
            <div className='body2'><span className='review-label'>{`${t('external_access.first_name')}: `}</span>{getValues('firstName')}</div>
            <div className='body2'><span className='review-label'>{`${t('external_access.last_name')}: `}</span>{getValues('lastName')}</div>
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.dob')}: `}</span>{utils.formatDate(getValues('dob'))}</div>
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.mobile_phone')}: `}</span>{utils.formatPhone(getValues('mobilePhone'))}</div>
            {
                getValues('email') ?
                    <div className='body2'><span className='review-label'>{`${t('external_access.registration.email')}: `}</span>{getValues('email')}</div>
                    : null
            }
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.address')}: `}</span>{displayAddressField()}</div>
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.sex')}: `}</span>{displayGender()}</div>
            <div className='pt-10'></div>
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.text_consent_short')}: `}</span>{displayConsents('text')}</div>
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.call_consent_short')}: `}</span>{displayConsents('call')}</div>
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.preferred_communication_short')}: `}</span>{t(`${displayPreferredCommunication(getValues('preferredCommunication'))}`)}</div>
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.referral_source')}: `}</span>{t(`${displayReferralSource(getValues('referralSource'))}`)}</div>
            <div className='pt-10'></div>
            {
                insuranceOption?.value === 'insurance_plan' ?
                    <>
                        <div className='body2'><span className='review-label'>{`${t('external_access.registration.insurance_type')}: `}</span>{getValues('insuranceType')}</div>
                        <div className='body2'><span className='review-label'>{`${t('external_access.registration.insurance_name')}: `}</span>{getValues('insuranceName')}</div>
                        <div className='body2'><span className='review-label'>{`${t('external_access.registration.policy_holder_name')}: `}</span>{getValues('policyHolderName')}</div>
                        <div className='body2'><span className='review-label'>{`${t('external_access.registration.policy_holder_dob')}: `}</span>{utils.formatDate(getValues('policyHolderDob'))}</div>
                        <div className='body2'><span className='review-label'>{`${t('external_access.registration.policy_holder_relationship')}: `}</span>{getValues('insuranceRelation')}</div>
                        <div className='body2'><span className='review-label'>{`${t('external_access.registration.insurance_member_id')}: `}</span>{getValues('insuranceMemberId')}</div>
                        <div className='body2'><span className='review-label'>{`${t('external_access.registration.group_number')}: `}</span>{getValues('groupNumber')}</div>
                    </> : <div className='body2'><span className='review-label'>{`${t('external_access.registration.insurance_info')}: `}</span>{t(`${insuranceOption?.label}`)}</div>
            }

        </div>
    );
}

export default RegistrationReviewStep;