import React from 'react';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {AssociatedContact} from '@shared/models/associated-contact.model';
import {useHistory} from 'react-router';
import {ContactsPath} from '@app/paths';

interface AsocciatedContactsItemProps {
    contact: AssociatedContact
}
const AsocciatedContactsItem = ({contact}: AsocciatedContactsItemProps) => {
    const history = useHistory();
    return (
        <div className='associated-contacts-item h-10 border-b contact-border-color-lighter body2 grid grid-cols-4 items-center'>
            <span>{`${contact.firstName} ${contact.lastName}`}</span>
            <span>{contact.jobTitle || contact.department || ''}</span>
            <div className='justify-self-end pr-6 cursor-pointer'>
                <SvgIcon dataTestId={contact.id} type={Icon.View} fillClass='contact-light-fill' onClick={() => {history.push(`${ContactsPath}/${contact.id}`)}} />
            </div>
        </div>
    )
}

export default AsocciatedContactsItem;