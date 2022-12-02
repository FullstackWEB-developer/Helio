import React, {useEffect, useState} from 'react';
import './patient-hover-info.scss';
import {useQuery} from 'react-query';
import Spinner from '@components/spinner/Spinner';
import Avatar from '@components/avatar';
import utils from '@shared/utils/utils';
import {useTranslation} from 'react-i18next';
import Button from '@components/button/button';
import {useHistory} from 'react-router-dom';
import {Icon} from '@components/svg-icon';
import {EmailPath} from '@app/paths';
import {NEW_EMAIL} from '@pages/email/constants';
import TicketCreatedForHoverLabel from '@pages/tickets/components/ticket-detail/ticket-created-for-hover-label';
import {GetContactById} from '@constants/react-query-constants';
import {getContactById} from '@shared/services/contacts.service';
import {ContactType} from '@pages/contacts/models/ContactType';
import './contact-hover-info.scss';
import {getLookupValues} from '@shared/services/lookups.service';
import {useDispatch, useSelector} from 'react-redux';
import {selectLookupValues} from '@pages/tickets/store/tickets.selectors';
import ContactCommunicationPanel from '@pages/contacts/components/contact-communication-panel';
import ElipsisTooltipTextbox from '@components/elipsis-tooltip-textbox/elipsis-tooltip-textbox';

export interface ContactHoverInfoProps {
    contactId: string;
    isVisible: boolean;
}
const ContactHoverInfo= ({contactId, isVisible}: ContactHoverInfoProps) => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [contactCategory, setContactCategory] = useState<string>();
    const {data: contact, isLoading} = useQuery([GetContactById, contactId], () => getContactById(contactId));
    const contactCategories = useSelector(state => selectLookupValues(state, "ContactCategory"));


    useEffect(() => {
        if (!contact || !contactCategories || contactCategories.length === 0) {
            return;
        }
        const category = contactCategories.find(a => a.value === contact.category.toString());
        if (!!category) {
            setContactCategory(category.label);
        }
    }, [contactCategories, contact])

    useEffect(() => {
        dispatch(getLookupValues('ContactCategory'));
    }, [dispatch]);

    if (isLoading) {
        return <div className='contact-hover-info-wrapper'>
            <Spinner fullScreen={true}/>
        </div>
    }

    if (!contact) {
        return <div className='contact-hover-info-wrapper'>
            {t('tickets.hover_info.error_getting_contact_details')}
        </div>
    }


    const sendEmail = () =>{
        if (!!contact.emailAddress) {
            history.push(`${EmailPath}/${NEW_EMAIL}`, {
                contact
            });
        }
    }

    const getContactName = () => {
        if(contact.type === ContactType.Company) {
            return contact.companyName;
        }
        return utils.stringJoin(' ', contact.firstName, contact.lastName)
    }

    const getSuffixForMainPhone = () => {
        if(contact.type === ContactType.Company) {
            return null;
        }
        if (!contact.workMainExtension) {
            return null;
        }
        return <div className='flex flex-row pl-4'>
            <div className='body-medium pr-1'>
                {t('tickets.hover_info.ext')}
            </div>
            <div>
                {contact.workMainExtension}
            </div>
        </div>
    }

    return <div className='absolute border-1 bg-white z-50 contact-hover-info-wrapper flex flex-col border-1 rounded-sm'>
        <div className='pl-4 pr-4.5 pt-6 pb-2 contact-hover-info-header border-b border-gray-200'>
            <div>
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row items-center w-full'>
                        <div>
                            <Avatar className='w-10 h-10 subtitle2 avatar-contact' userFullName={getContactName()} />
                        </div>
                        <div className='pl-4 relative w-full'>
                            <div className='h6'>
                                {getContactName()}
                            </div>
                            {contact.type === ContactType.Individual && <div className='body2 absolute w-full'>
                                <ElipsisTooltipTextbox value={!!contact.jobTitle ? t('tickets.hover_info.contact_position', {
                                    title: contact.jobTitle,
                                    company: contact.companyName
                                }) : contact.companyName} asSpan={false}
                                                       classNames='ticket-created-for-hover-label-text body2-medium'
                                                       isDefaultTextClass={false} />

                            </div>}

                        </div>
                    </div>
                    <div className='body2'>{t("tickets.hover_info.contact_title")}</div>
                </div>
                <div className='pl-12'>
                    <ContactCommunicationPanel isVisible={isVisible} contact={contact}/>
                </div>
            </div>

        </div>
        <div className='pt-6 pb-4 flex flex-col pl-4 space-y-2'>
            <TicketCreatedForHoverLabel
                label='tickets.hover_info.category'
                isActive={false}
                linkText={contactCategory}
            />

            <TicketCreatedForHoverLabel
                label='tickets.hover_info.department'
                isActive={false}
                linkText={contact.department}
            />

            <TicketCreatedForHoverLabel
                label='tickets.hover_info.email'
                isActive={!!contact.emailAddress}
                icon={Icon.Email}
                linkText={contact.emailAddress}
                onClick={() => sendEmail()}
            />
            <TicketCreatedForHoverLabel
                label='tickets.hover_info.work_main_phone'
                isActive={!!contact.workMainPhone}
                icon={Icon.Phone}
                linkText={utils.formatPhone(contact.workMainPhone)}
                onClick={() => utils.initiateACall(contact?.workMainPhone)}
                suffix={getSuffixForMainPhone()}
            />

            {contact.type === ContactType.Individual && <TicketCreatedForHoverLabel
                label='tickets.hover_info.work_direct_phone'
                isActive={!!contact.workDirectPhone}
                icon={Icon.Phone}
                linkText={utils.formatPhone(contact.workDirectPhone)}
                onClick={() => utils.initiateACall(contact?.workDirectPhone)}
            />}

            <TicketCreatedForHoverLabel
                label='tickets.hover_info.mobile_phone'
                isActive={!!contact.mobilePhone}
                icon={Icon.Phone}
                linkText={utils.formatPhone(contact.mobilePhone)}
                onClick={() => utils.initiateACall(contact?.mobilePhone)}
            />

            <TicketCreatedForHoverLabel
                label='tickets.hover_info.fax'
                isActive={false}
                icon={Icon.Phone}
                linkText={utils.formatPhone(contact.fax)}
            />

            <TicketCreatedForHoverLabel
                label='tickets.hover_info.website'
                isActive={!!contact.website}
                linkText={contact.website}
                onClick={() => contact.website && utils.openWebSite(contact.website)}
            />

        </div>
        <div className='contact-hover-info-button-wrapper h-24 pl-4 pt-6 bottom-0 w-full'>
            <Button label='tickets.hover_info.view_contact' onClick={() => history.push(`/contacts/${contactId}`)}/>
        </div>
    </div>
}

export default ContactHoverInfo;
