import React from 'react';
import ContactInfoField from './contact-info-field';
import AssociatedContacts from './associated-contacts';
import {useTranslation} from 'react-i18next';
import {Icon} from '@components/svg-icon/icon';
import {Contact} from '@shared/models/contact.model';
import SvgIcon from '@components/svg-icon/svg-icon';
import {ContactType} from '../models/ContactType';
import ContactForm from './contact-form';
interface CompanyContactDetailsProps {
    contact: Contact,
    editMode?: boolean,
    initiateACall?: () => void
}
const CompanyContactDetails = ({editMode, contact, initiateACall}: CompanyContactDetailsProps) => {
    const {t} = useTranslation();
    return (
        !editMode ?
            (
                <>
                    <div className="grid grid-cols-8 gap-2 body2 mb-10">
                        <ContactInfoField label={`${t('contacts.contact-details.individual.category')}`} value={'Facility'} />
                        <ContactInfoField label={`${t('contacts.contact-details.individual.email')}`} value={'info@advantagemri.com'}
                            icon={Icon.Email} iconOnClick={initiateACall} />
                        <ContactInfoField label={`${t('contacts.contact-details.individual.work_main_phone')}`} value={'(310) 440-0098'}
                            icon={Icon.Phone} iconOnClick={initiateACall} />
                        <ContactInfoField label={`${t('contacts.contact-details.individual.website')}`} value={'www.advantagemri.com'} />
                        <ContactInfoField label={`${t('contacts.contact-details.individual.address')}`} value={'100 Lincoln Blvd'} />
                        <ContactInfoField value={'Manhattan Beach, CA 90277'} />
                    </div>
                    <AssociatedContacts contact={contact} />
                    <div className='flex items-center cursor-pointer body2 pt-5'>
                        <span className='pr-4'><SvgIcon type={Icon.AddContact} fillClass='contact-light-fill' /></span>
                        {t('contacts.contact-details.company.add_contact')}
                    </div>
                </>
            ) : <ContactForm contactType={ContactType.Company} />
    )
}

export default CompanyContactDetails;