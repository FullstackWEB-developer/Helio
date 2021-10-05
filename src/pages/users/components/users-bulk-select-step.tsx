import Checkbox, {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import {ExternalUser, InviteUserModel} from '@shared/models';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {selectExternalUsersSelection} from '../store/users.selectors';
import {addExternalUserToSelection, removeExternalUserFromSelection} from "../store/users.slice";
import classnames from 'classnames';
const UserBulkSelectStep = ({externalUsers}: {externalUsers: ExternalUser[]}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const selectedExternalUsers = useSelector(selectExternalUsersSelection);
    const handleCheckboxChange = (e: CheckboxCheckEvent, user: ExternalUser) => {
        if (user?.mail && user?.azureId) {
            const inviteModel: InviteUserModel = {
                email: user?.mail,
                ...(user?.givenName && {firstName: user?.givenName}),
                ...(user?.surname && {lastName: user?.surname})
            }
            e.checked ?
                dispatch(addExternalUserToSelection({id: user.azureId, inviteUserModel: inviteModel, info: user})) :
                dispatch(removeExternalUserFromSelection(user.azureId));
        }
    }

    return (
        <div className='w-full overflow-y-auto relative'>
            <div className='bulk-user-grid col-template-step-1 head-row caption-caps h-12 px-4'>
                <div></div>
                <div className='truncate'>{t('users.bulk_section.name')}</div>
                <div className='truncate'>{t('users.bulk_section.department')}</div>
                <div className='truncate'>{t('users.bulk_section.job_title')}</div>
            </div>
            {
                externalUsers && externalUsers.length > 0 &&
                externalUsers.map((u, index) => (
                    <div key={u.azureId || `external-user-${index}`} className='bulk-user-grid data-row col-template-step-1 h-14 px-4 body2'>
                        <div>
                            {
                                u.azureId && u.mail &&
                                <Checkbox checked={selectedExternalUsers.findIndex(user => user.id === u.azureId) !== -1} onChange={(e) => {handleCheckboxChange(e, u)}} label='' value={u.azureId} className='pt-2' name={`${u.azureId}-check`} />
                            }
                        </div>
                        <div className='flex flex-col truncate'>
                            <span>{u.displayName || ''}</span>
                            <span className={classnames('body3-medium', {'text-danger': !u.mail})}>{u.mail ?? t('users.bulk_section.invite_no_email')}</span>
                        </div>
                        <div className='truncate'>{u.department || ''}</div>
                        <div className='truncate'>{u.jobTitle || ''}</div>
                    </div>
                ))
            }
        </div>
    )
}

export default UserBulkSelectStep;