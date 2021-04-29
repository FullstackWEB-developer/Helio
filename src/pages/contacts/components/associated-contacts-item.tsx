import React from 'react';
import {Contact} from '@shared/models/contact.model';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';

interface AsocciatedContactsItemProps {
    contact: Contact
}
const AsocciatedContactsItem = ({contact}: AsocciatedContactsItemProps) => {
    return (
        <div className="h-10 border-b contact-border-color-lighter body2 grid grid-cols-4 items-center">
            <span>{contact.name}</span>
            <span>Manager</span>
            <span>Advantage MRI</span>
            <div className='justify-self-end pr-6 cursor-pointer'><SvgIcon type={Icon.View} fillClass='contact-light-fill'/></div>            
        </div>
    )
}

export default AsocciatedContactsItem;