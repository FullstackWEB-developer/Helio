import {Icon} from '@components/svg-icon/icon';
import {selectVoiceCounter} from '@pages/ccp/store/ccp.selectors';
import ContactInfoField from '@pages/contacts/components/contact-info-field';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import utils from '@shared/utils/utils';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

const ConversationHeaderPatientDetails = ({patient, outsideEmailInboxView = false}: {patient: ExtendedPatient, outsideEmailInboxView?: boolean}) => {
    const {t} = useTranslation();
    const voiceCounter = useSelector(selectVoiceCounter);
    const displayValue = (value: string | undefined, isPhone = false) => {
        return value ? isPhone ? utils.formatPhone(value) : value : t('common.not_available');
    }
    const phoneIconOnClick = (phoneNumber?: string) => {
        utils.initiateACall(phoneNumber);
    }
    const getIconFillClass = (value?: string) => {
        return !!value ? 'success-icon' : '';
    }
    return (
        <div className="px-4 pb-4 pt-6 grid grid-cols-8 gap-1 body2">
            {patient?.mobilePhone && <ContactInfoField
                label={`${t('contacts.contact_details.individual.mobile_phone')}`}
                labelClass='col-span-2'
                value={displayValue(patient.mobilePhone, true)}
                valueClass={'flex col-span-6'}
                iconFillClass={getIconFillClass(patient.mobilePhone)}
                icon={Icon.Phone}
                isIconDisabled={voiceCounter === 1 || !patient.mobilePhone}
                iconOnClick={() => phoneIconOnClick(patient.mobilePhone)}
                isValueClickDisabled={voiceCounter === 1 || !patient.mobilePhone}
                isLink={!(voiceCounter === 1 || !patient.mobilePhone)}
                onValueClick={() => phoneIconOnClick(patient.mobilePhone)} />}
            {
                patient?.homePhone && <ContactInfoField
                    label={`${t('contacts.contact_details.individual.home_phone')}`}
                    labelClass='col-span-2'
                    value={displayValue(patient.homePhone, true)}
                    valueClass={'flex col-span-6'}
                    iconFillClass={getIconFillClass(patient.homePhone)}
                    icon={Icon.Phone}
                    isIconDisabled={voiceCounter === 1 || !patient.homePhone}
                    iconOnClick={() => phoneIconOnClick(patient.homePhone)}
                    isValueClickDisabled={voiceCounter === 1 || !patient.homePhone}
                    isLink={!(voiceCounter === 1 || !patient.homePhone)}
                    onValueClick={() => phoneIconOnClick(patient.homePhone)} />
            }
            {
                patient?.emailAddress && <ContactInfoField
                    label={`${t('contacts.contact_details.individual.email')}`}
                    labelClass='col-span-2'
                    value={displayValue(patient.emailAddress, false)}
                    valueClass={'flex col-span-6'}
                    iconFillClass={getIconFillClass(patient.emailAddress)}
                    icon={Icon.Email}
                    isIconDisabled={!patient.emailAddress}
                    isValueClickDisabled={!patient.emailAddress}
                    isLink={true} />
            }
        </div>
    )
}

export default ConversationHeaderPatientDetails;