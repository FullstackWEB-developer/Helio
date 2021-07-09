import React from 'react';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {ContactExtended} from '@shared/models/contact.model';
import Spinner from '@components/spinner/Spinner';
interface ContactHeaderQuickActionsProps {
    editMode?: boolean;
    editIconClickHandler?: () => void;
    contact: ContactExtended;
    starIconClickHandler?: () => void;
    deleteIconClickHandler?: () => void;
    isLoading: boolean;
}
const ContactHeaderQuickActions = ({editMode, editIconClickHandler, contact, starIconClickHandler, isLoading, deleteIconClickHandler}: ContactHeaderQuickActionsProps) => {
    return (
        isLoading ? <Spinner /> :
            <div className='flex justify-center'>
                <span className={`pr-6 cursor-pointer`} >
                    <SvgIcon onClick={starIconClickHandler} type={Icon.Star} fillClass={`contact-header-quick-action-color${contact?.isStarred ? '-starred' : ''}`} />
                </span>
                {
                    !editMode && <span className="pr-6 cursor-pointer">
                        <SvgIcon type={Icon.Email} fillClass='contact-header-quick-action-color' />
                    </span>
                }
                {!editMode && <span className="pr-6 cursor-pointer" onClick={editIconClickHandler}><SvgIcon type={Icon.Edit} fillClass='contact-header-quick-action-color' /></span>}
                <span className="pr-6 cursor-pointer" onClick={deleteIconClickHandler}>
                    <SvgIcon type={Icon.Delete} fillClass='contact-header-quick-action-color' />
                </span>
            </div>
    )
}

export default ContactHeaderQuickActions;
