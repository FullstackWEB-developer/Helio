import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import {ContactType} from '@shared/models/contact-type.enum';
import {ContactExtended} from '@shared/models/contact.model';
import React, {useState} from 'react';

interface ContactListItemProps {
    contact: ContactExtended,
    selected?: boolean,
    onSelect?: (value: ContactExtended) => void
}
const ContactListItem = ({contact, selected, onSelect}: ContactListItemProps) => {
    const [hovered, setHovered] = useState(false);
    const isCompany = contact.type === ContactType.Company;
    const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (onSelect) {
            onSelect(contact);
        }
    }
    return (
        <div
            onMouseOver={() => setHovered(true)}
            onMouseOut={() => setHovered(false)}
            onClick={onClick}
            className={`max-h-10 max-w-full truncate body2 pl-6 py-2.5 relative border-b cursor-pointer${selected || hovered ? ' company-item-selected' : ''}`}>
            <div className='pr-10 truncate'>{isCompany ? contact.companyName : `${contact.firstName} ${contact.lastName}`}</div>
            {
                isCompany && <span className="absolute top-2 right-4"><SvgIcon fillClass="company-fill" type={Icon.Company} /></span>
            }
        </div>
    )
}

export default ContactListItem;