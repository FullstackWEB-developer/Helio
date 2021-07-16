import React from 'react';
import {ContactAvatarModel} from '../models/contact-avatar-model';
import {ContactExtended} from '@shared/models/contact.model';
import ContactHeaderQuickActions from './contact-header-quick-actions';
import {Icon} from '@components/svg-icon/icon';
import ContactAvatar from './contact-avatar';
import {ContactType} from '@shared/models/contact-type.enum';
import utils from '@shared/utils/utils';
import ContactSubheaderQuickActions from '@pages/contacts/components/contact-subheader-quick-actions';
interface ContactHeaderProps {
    contact: ContactExtended,
    editMode: boolean,
    editIconClickHandler?: () => void,
    starIconClickHandler?: () => void,
    deleteIconClickHandler?: () => void,
    isLoading: boolean
}
const ContactHeader = ({contact, editMode, editIconClickHandler, starIconClickHandler, isLoading, deleteIconClickHandler}: ContactHeaderProps) => {
    const isCompany = contact.type === ContactType.Company;
    const avatarModel: ContactAvatarModel = {
        initials: !isCompany ? `${utils.getInitialsFromFullName(`${contact.firstName} ${contact.lastName}`)}` : '',
        className: 'h-24 w-24',
        isCompany,
        iconClassName: 'icon-large-40',
        iconFillClass: 'company-avatar-color',
        iconType: Icon.Company
    }
    return (
        <div className="w-full flex px-8 pt-6 pb-4 mt-4 justify-between">
            <div className="flex items-start">
                <ContactAvatar model={avatarModel} />
                <div className="flex flex-col pl-6">
                    <h4>{isCompany ? contact.companyName : `${contact.firstName} ${contact.lastName}`}</h4>
                    {
                        !isCompany && (contact.description || contact.jobTitle) && <div className="pt-3 contact-light">{contact.description || contact.jobTitle}</div>
                    }
                    <ContactSubheaderQuickActions contact={contact} editMode={editMode}
                                                  editIconClickHandler={editIconClickHandler}
                                                  deleteIconClickHandler={deleteIconClickHandler} isLoading={isLoading} />
                </div>
            </div>
            <ContactHeaderQuickActions contact={contact}
                                       starIconClickHandler={starIconClickHandler}
                                       isLoading={isLoading} />
        </div>
    )
}

export default ContactHeader;
