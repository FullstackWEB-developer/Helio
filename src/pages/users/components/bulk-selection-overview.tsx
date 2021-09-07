import {SelectExternalUser} from "@shared/models";
import React from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {selectExternalUsersSelection} from "../store/users.selectors";

const BulkSelectionOverview = () => {
    const {t} = useTranslation();
    const selectedExternalUsers = useSelector(selectExternalUsersSelection);
    const availableDepartments = selectedExternalUsers
        .map((u: SelectExternalUser) => u.info?.department || '')
        .filter(d => !!d)
        .filter((v, i, a) => a.indexOf(v) === i) || [];

    const availableRoles = selectedExternalUsers
        .map((u: SelectExternalUser) => u.inviteUserModel?.roles && u.inviteUserModel.roles.length > 0 ? u.inviteUserModel.roles[0] : '')
        .filter(d => !!d)
        .filter((v, i, a) => a.indexOf(v) === i) || [];

    return (
        <div className='flex flex-col subtitle2 pt-7'>
            <div>
                <span className='body2 bulk-review-labels'>{t('users.bulk_section.users')}</span>
                <span>{` ${selectedExternalUsers?.length}`}</span>
            </div>
            <div>
                <span className='body2 bulk-review-labels'>{t('users.bulk_section.department_selected')}</span>
                {` ${availableDepartments?.join(', ')}`}
            </div>
            <div>
                <span className='body2 bulk-review-labels'>{t('users.bulk_section.roles_applied')}</span>
                {` ${availableRoles.join(', ')}`}
            </div>
        </div>
    )
}

export default BulkSelectionOverview;