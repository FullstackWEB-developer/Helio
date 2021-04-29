import React from 'react';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
interface ContactHeaderQuickActionsProps {
    editMode?: boolean;
    editIconClickHandler?: () => void
}
const ContactHeaderQuickActions = ({editMode, editIconClickHandler}: ContactHeaderQuickActionsProps) => {
    return (
        <div className='flex justify-center'>
            <span className="pr-6 cursor-pointer"><SvgIcon type={Icon.Star} fillClass='contact-header-quick-action-color' /></span>
            <span className="pr-6 cursor-pointer"><SvgIcon type={!editMode ? Icon.Email : Icon.Save} onClick={!editMode ? ()=>{} : editIconClickHandler} fillClass='contact-header-quick-action-color' /></span>
            {!editMode && <span className="pr-6 cursor-pointer" onClick={editIconClickHandler}><SvgIcon type={Icon.Edit} fillClass='contact-header-quick-action-color' /></span>}
            <span className="pr-6 cursor-pointer"><SvgIcon type={Icon.Delete} fillClass='contact-header-quick-action-color' /></span>
        </div>
    )
}

export default ContactHeaderQuickActions;