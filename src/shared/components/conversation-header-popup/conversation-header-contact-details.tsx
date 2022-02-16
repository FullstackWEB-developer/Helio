import React from 'react';
import {ContactExtended} from '@shared/models';
import ContactInfoField from '@pages/contacts/components/contact-info-field';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import {Option} from '@components/option/option';
import utils from '@shared/utils/utils';
import {Icon} from '@components/svg-icon';
import {EmailPath} from '@app/paths';
import {NEW_EMAIL} from '@pages/email/constants';
import {useHistory} from 'react-router';
import {selectVoiceCounter} from '@pages/ccp/store/ccp.selectors';

const ConversationHeaderContactDetails = ({contact, outsideEmailInboxView = false}: {contact: ContactExtended, outsideEmailInboxView?: boolean}) => {
    const {t} = useTranslation();
    const history = useHistory();
    const facilityTypes = useSelector(state => selectLookupValues(state, 'ContactCategory'));
    const voiceCounter = useSelector(selectVoiceCounter);
    const getCategoryName = (category: number | Option) => {
        const calculated = category && category.hasOwnProperty('value') ? (category as Option).value : category?.toString();
        if (!calculated) {
            return '';
        }
        return facilityTypes.filter(a => a.value === calculated).length > 0 ? facilityTypes.filter(a => a.value === calculated)[0].label : '';
    };
    const displayValue = (value: string | undefined, isPhone = false) => {
        return value ? isPhone ? utils.formatPhone(value) : value : t('common.not_available');
    }
    const emailOnClick = () => {
        if(!outsideEmailInboxView){
            return;
        } 
        const pathName = `${EmailPath}/${NEW_EMAIL}`;
        history.push({
            pathname: pathName,
            state: {
                contact
            }
        });
    }
    const phoneIconOnClick = (phoneNumber?: string) => {
        utils.initiateACall(phoneNumber);
    }
    return (
        <div className="px-4 pb-4 pt-6 grid grid-cols-8 gap-1 body2">
            {contact?.category && <ContactInfoField label={`${t('contacts.contact_details.individual.category')}`}
                value={getCategoryName(contact.category)} 
                labelClass='col-span-3' 
                valueClass='col-span-5 flex' />}
            {contact?.department && <ContactInfoField label={`${t('contacts.contact_details.individual.department')}`}
                value={displayValue(contact.department)} 
                labelClass='col-span-3' 
                valueClass='col-span-5 flex' />}
            {contact?.emailAddress && <ContactInfoField label={`${t('contacts.contact_details.individual.email')}`}
                value={displayValue(contact.emailAddress)}
                icon={Icon.Email}
                onValueClick={() => emailOnClick()}
                iconOnClick={() => emailOnClick()}
                iconFillClass='success-icon'
                isIconDisabled={!contact.emailAddress}
                labelClass='col-span-3' 
                valueClass='col-span-5 flex' />}
            {contact?.workMainPhone && <ContactInfoField label={`${t('contacts.contact_details.individual.work_main_phone')}`}
                value={displayValue(contact.workMainPhone, true)}
                icon={Icon.Phone}
                appendix={true}
                labelClass='col-span-3'
                isIconDisabled={voiceCounter === 1}
                isValueClickDisabled={voiceCounter === 1}
                onValueClick={() => phoneIconOnClick(contact.workMainPhone)}
                iconFillClass='success-icon'
                appendixLabel={t('contacts.contact_details.individual.ext')}
                appendixValue={contact.workMainExtension}
                iconOnClick={() => phoneIconOnClick(contact.workMainPhone)}
                isLink={!(voiceCounter === 1)} 
                valueClass='col-span-5 flex'
            />}
            {contact?.workDirectPhone && <ContactInfoField label={`${t('contacts.contact_details.individual.work_direct_phone')}`}
                value={displayValue(contact.workDirectPhone, true)}
                isIconDisabled={voiceCounter === 1}
                iconFillClass='success-icon'
                icon={Icon.Phone}
                iconOnClick={() => phoneIconOnClick(contact.workDirectPhone)}
                isLink={!(voiceCounter === 1)}
                isValueClickDisabled={voiceCounter === 1}
                onValueClick={() => phoneIconOnClick(contact.workDirectPhone)}
                labelClass='col-span-3' 
                valueClass='col-span-5 flex'
            />}
            {contact?.mobilePhone && <ContactInfoField label={`${t('contacts.contact_details.individual.mobile_phone')}`}
                value={displayValue(contact.mobilePhone, true)}
                iconFillClass='success-icon'
                icon={Icon.Phone}
                isIconDisabled={voiceCounter === 1}
                iconOnClick={() => phoneIconOnClick(contact.mobilePhone)}
                isValueClickDisabled={voiceCounter === 1}
                isLink={!(voiceCounter === 1)}
                onValueClick={() => phoneIconOnClick(contact.mobilePhone)}
                labelClass='col-span-3' valueClass='col-span-5 flex' />}
            {contact?.website && <ContactInfoField label={`${t('contacts.contact_details.individual.website')}`}
                value={displayValue(contact.website)}
                onValueClick={() => contact.website && utils.openWebSite(contact.website)}
                isLink={!!contact.website} 
                labelClass='col-span-3' 
                valueClass='col-span-5 flex' />}
        </div>
    );
}

export default ConversationHeaderContactDetails;
