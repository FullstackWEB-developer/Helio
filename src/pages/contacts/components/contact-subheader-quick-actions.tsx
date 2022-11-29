import React from 'react';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {ContactExtended} from '@shared/models/contact.model';
import ContactCommunicationPanel from '@pages/contacts/components/contact-communication-panel';

interface ContactHeaderQuickActionsProps {
    editMode?: boolean;
    editIconClickHandler?: () => void;
    contact: ContactExtended;
    deleteIconClickHandler?: () => void;
    isLoading: boolean;
}

const ContactSubheaderQuickActions = ({editMode, editIconClickHandler, contact, isLoading, deleteIconClickHandler}: ContactHeaderQuickActionsProps) => {
        return <div className='flex flex-row items-center'>
            <ContactCommunicationPanel isVisible={true} contact={contact} editMode={editMode} />
            {!editMode && <span className="pr-8 cursor-pointer pt-5" onClick={editIconClickHandler}>
                <SvgIcon type={Icon.EditCircled}
                    className='icon-x-large'
                    fillClass='contact-subheader-quick-action-color'
                    strokeClass='contact-stroke-color'
                />
            </span>}
            <span className="pr-8 cursor-pointer pt-5" onClick={deleteIconClickHandler}>
                <SvgIcon type={Icon.DeleteCircled}
                    className='icon-x-large'
                    fillClass='contact-subheader-quick-action-color'
                    strokeClass='contact-stroke-color'
                    isLoading={isLoading}
                />
            </span>
        </div>
}

export default ContactSubheaderQuickActions;
