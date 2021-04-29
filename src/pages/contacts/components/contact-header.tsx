import React from 'react';
import {ContactAvatarModel} from '../models/ContactAvatarModel';
import {Contact} from '@shared/models/contact.model';
import ContactHeaderQuickActions from './contact-header-quick-actions';
import {Icon} from '@components/svg-icon/icon';
import ContactAvatar from './contact-avatar';
interface ContactHeaderProps {
    contact: Contact,
    editMode: boolean,
    editIconClickHandler?: () => void
}
const ContactHeader = ({contact, editMode, editIconClickHandler}: ContactHeaderProps) => {
    const avatarModel: ContactAvatarModel = {
        initials: contact.name.trim().split(' ').map(name => name.charAt(0)).join(''),
        className: 'h-24 w-24',
        isCompany: contact.isCompany,
        iconClassName: 'icon-large-40',
        iconFillClass: 'company-avatar-color',
        iconType: Icon.Company
    }
    return (
        <div className="h-32 w-full flex px-8 pt-6 pb-4 items-center justify-between">
            <div className="flex items-start">
                <ContactAvatar model={avatarModel} />
                <div className="flex flex-col pl-6">
                    <h4>{contact.name}</h4>
                    {
                        !contact.isCompany && <div className="pt-3 contact-light">Manager at Advantage MRI</div>
                    }
                </div>

            </div>
            <ContactHeaderQuickActions editMode={editMode} editIconClickHandler={editIconClickHandler} />
        </div>
    )
}

export default ContactHeader;