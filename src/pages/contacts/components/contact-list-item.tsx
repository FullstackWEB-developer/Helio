import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import {ContactExtended} from '@shared/models/contact.model';
import React, {useState} from 'react';
import classNames from 'classnames';
import {ContactType} from '@pages/contacts/models/ContactType';

interface ContactListItemProps {
    contact: ContactExtended,
    selected?: boolean,
    onSelect?: (value: ContactExtended) => void,
    previousContact?: ContactExtended;
    isSearch?: boolean;
}
const ContactListItem = ({contact, selected, onSelect, previousContact, isSearch}: ContactListItemProps) => {
    const [hovered, setHovered] = useState(false);
    const isCompany = contact.type === ContactType.Company;
    const onClick = () => {
        if (onSelect) {
            onSelect(contact);
        }
    }

    const wrapperClass = classNames('max-h-10 max-w-full truncate body2 py-2.5 relative border-b cursor-pointer', {
        'company-item-hovered' : hovered && !selected,
        'company-item-selected' : selected,
        'pl-6' : !(!!contact.relatedId) || !isSearch,
        'pl-9' : isSearch &&
            (contact.relatedId === previousContact?.id || contact.relatedId === previousContact?.relatedId) &&
            (!!previousContact?.relatedId || !!contact.relatedId)
    });

    return (
        <div
            onMouseOver={() => setHovered(true)}
            onMouseOut={() => setHovered(false)}
            onClick={onClick}
            className={wrapperClass}>
            <div className={`pr-10 truncate ${selected ? 'company-item-selected-inverted' : ''}`}>
                {isCompany ? contact.companyName : `${contact.firstName} ${contact.lastName}`}
            </div>
            {
                isCompany && <span className="absolute top-2 right-4"><SvgIcon fillClass={`${selected ? 'company-fill-inverted' : 'company-fill'}`} type={Icon.Company} /></span>
            }
        </div>
    )
}

export default ContactListItem;
