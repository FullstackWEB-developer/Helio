import {Contact} from '@shared/models/contact.model';
import React from 'react';
import {useTranslation} from 'react-i18next';
import AssociatedContactsItem from './associated-contacts-item';

interface AssociatedContactsProps {
    contact: Contact
}
const AssociatedContacts = ({contact}: AssociatedContactsProps) => {
    const {t} = useTranslation();
    return (
        <div>
            <div className="h-10 border-b contact-border-color mb-4">
                {`${t('contacts.contact-details.company.associated_with', {companyName: contact.name})}`}
            </div>
            <AssociatedContactsItem contact={contact} />
            <AssociatedContactsItem contact={contact} />
            <AssociatedContactsItem contact={contact} />
            <AssociatedContactsItem contact={contact} />
        </div>
    )
}

export default AssociatedContacts;