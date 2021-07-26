import React from 'react';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {ContactExtended} from '@shared/models/contact.model';
interface ContactHeaderQuickActionsProps {
    contact: ContactExtended;
    starIconClickHandler?: () => void;
    isLoading: boolean;
}
const ContactHeaderQuickActions = ({contact, starIconClickHandler, isLoading}: ContactHeaderQuickActionsProps) => {
    return (
        <div className='pt-1.5 cursor-pointer'>
            <SvgIcon onClick={starIconClickHandler} type={Icon.Star} isLoading={isLoading} fillClass={`contact-header-quick-action-color${contact?.isStarred ? '-starred' : ''}`} />
        </div>
    )
}

export default ContactHeaderQuickActions;
