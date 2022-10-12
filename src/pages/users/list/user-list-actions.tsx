import {UsersPath} from '@app/paths';
import Confirmation from '@components/confirmation/confirmation';
import Dropdown, {DropdownItemModel, DropdownModel} from '@components/dropdown';
import SvgIcon, {Icon} from '@components/svg-icon';
import {customHooks, useSmartPosition} from '@shared/hooks';
import {ChangeUserStatusRequest, InviteUserRequest, UserDetail, UserDetailStatus, UserInvitationStatus} from '@shared/models';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import classnames from 'classnames';
import MoreMenu from '@components/more-menu';

const UserListActions = ({user, handleStatusChange, handleResendInvite, forceToClose = false}:
    {user: UserDetail, handleStatusChange: (statuses: ChangeUserStatusRequest[]) => void, handleResendInvite: (resendInviteRequest: InviteUserRequest) => void, forceToClose?: boolean}) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
    const [disableConfirmationOpen, setDisableConfirmationOpen] = useState(false);
    const [forceMoreMenuClose, setForceMoreMenuClose] = useState(forceToClose);
    const dropdownContainerRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setForceMoreMenuClose(forceToClose);
    }, [forceToClose]);

    const generateDropdownModelOptions = (): DropdownModel => {
        let items: DropdownItemModel[] = [
            {value: t('users.list_section.edit'), label: t('users.list_section.edit')}
        ];
        if (user?.invitationStatus === UserInvitationStatus.Sent) {
            items.push({value: t('users.list_section.resend_invite'), label: t('users.list_section.resend_invite')});
        }
        if (user?.status) {
            let actionWording = t(`users.list_section.${user.status === 1 ? 'disable' : 'enable'}`);
            items.push({value: actionWording, label: actionWording});
        }
        return {
            items,
            onClick: (id) => handleDropdownClick(id)
        }
    };

    const handleDropdownClick = (id: string) => {
        switch (id) {
            case t('users.list_section.edit'): {
                history.push(`${UsersPath}/details/${user.id}`);
                break;
            }
            case t('users.list_section.resend_invite'): {
                handleResendInvite({users: [{email: user.email}], invitationMessage: ''});
                setActionDropdownOpen(false);
                break;
            }
            case t('users.list_section.enable'): {
                handleStatusChange([{id: user.id, userStatus: UserDetailStatus.Active}]);
                setActionDropdownOpen(false);
                break;
            }
            case t('users.list_section.disable'): {
                setDisableConfirmationOpen(true);
                setActionDropdownOpen(false);
                break;
            }
        }
    }

    customHooks.useOutsideClick([dropdownContainerRef], () => {
        setActionDropdownOpen(false);
    });

    const onDisableCancel = () => {
        setDisableConfirmationOpen(false);
    }

    const onDisableConfirm = () => {
        handleStatusChange([{id: user.id, userStatus: flipUserStatus(user.status)}]);
        onDisableCancel();
    }

    const flipUserStatus = (status: UserDetailStatus) => {
        return status === UserDetailStatus.Active ? UserDetailStatus.Inactive : UserDetailStatus.Active;
    }

    return (
        <>
            <MoreMenu
                dataTestId={`user-list-${user.id}-more-menu-toggle`}
                items={generateDropdownModelOptions().items}
                iconClassName='opacity-0 group-hover:opacity-100'
                onClick={(item) => handleDropdownClick(item.value)}
                closeOnMouseLeave={true}
                forceToClose={forceMoreMenuClose}
            />
            <div className='absolute top-0 w-1/3 left-1/3'>
                <Confirmation title={t('users.list_section.disable_modal_title_identity', {
                    name: user.firstName || user.lastName ?
                        `${user.firstName || ''} ${user.lastName || ''}` : t('common.user')
                })}
                    message={t('users.list_section.disable_modal_description_identity', {
                        name: user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}` : t('common.user')
                    })}
                    hasOverlay={true}
                    okButtonLabel={t('users.list_section.disable')} isOpen={disableConfirmationOpen}
                    onOk={onDisableConfirm} onCancel={onDisableCancel} onClose={onDisableCancel} />
            </div>
        </>
    );
}

export default UserListActions;
