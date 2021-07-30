import {AssociatedContact} from '@shared/models/associated-contact.model';
import React from 'react';
import {useTranslation} from 'react-i18next';
import AssociatedContactsItem from './associated-contacts-item';

interface AssociatedContactsProps {
    contacts: AssociatedContact[]
}
const AssociatedContacts = ({contacts}: AssociatedContactsProps) => {
    const {t} = useTranslation();
    return (
        <div>
            <div className="h-10 contact-border-color mb-4">
                {`${t('contacts.contact_details.company.associated_with', {companyName: contacts[0]?.companyName || ''})}`}
            </div>
            {
                contacts.map(c => <AssociatedContactsItem contact={c} key={c.id}/>)
            }
        </div>
    )
}

export default AssociatedContacts;
