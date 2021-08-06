import {UsersPath} from '@app/paths';
import Confirmation from '@components/confirmation/confirmation';
import Dropdown, {DropdownItemModel, DropdownModel} from '@components/dropdown';
import SvgIcon, {Icon} from '@components/svg-icon';
import {customHooks} from '@shared/hooks';
import {ChangeUserStatusRequest, InviteUserRequest, UserDetail, UserDetailStatus, UserInvitationStatus} from '@shared/models';
import {setModalOverlayActive} from '@shared/store/app/app.slice';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router';

const UserListActions = ({user, handleStatusChange, handleResendInvite}:
    {user: UserDetail, handleStatusChange: (statuses: ChangeUserStatusRequest[]) => void, handleResendInvite: (resendInviteRequest: InviteUserRequest) => void}) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
    const [disableConfirmationOpen, setDisableConfirmationOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const generateDopdownModelOptions = (): DropdownModel => {
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
                dispatch(setModalOverlayActive(true));
                setActionDropdownOpen(false);
                break;
            }
        }
    }

    customHooks.useOutsideClick([dropdownRef], () => {
        setActionDropdownOpen(false);
    });

    const calculateDropdownPosition = () => {
        let right = 0;
        if (dropdownRef && dropdownRef?.current) {
            const rightmostPoint = dropdownRef.current?.getBoundingClientRect()?.right;
            const iconRightPoint = iconRef.current?.getBoundingClientRect()?.right;
            if (rightmostPoint && iconRightPoint) {
                right = rightmostPoint - iconRightPoint;
            }
        }
        return {
            right: `${right}px`,
            top: 40
        }
    }

    const onDisableCancel = () => {
        setDisableConfirmationOpen(false);
        dispatch(setModalOverlayActive(false));
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
            <div ref={dropdownRef} className={`opacity-0 group-hover:opacity-100 ${actionDropdownOpen ? 'opacity-100' : ''} relative`}>
                <div ref={iconRef} className='w-6'>
                    <SvgIcon type={Icon.MoreVert} fillClass='user-list-icon-fill' onClick={() => setActionDropdownOpen(!actionDropdownOpen)} />
                </div>
                {
                    actionDropdownOpen &&
                    <div className='absolute z-20' style={calculateDropdownPosition()}>
                        <Dropdown model={generateDopdownModelOptions()} />
                    </div>
                }
            </div>
            <div className='absolute w-1/3 left-1/3 top-0'>
                <Confirmation title={t('users.list_section.disable_modal_title')}
                    message={t('users.list_section.disable_modal_description')}
                    okButtonLabel={t('users.list_section.disable')} isOpen={disableConfirmationOpen}
                    onOk={onDisableConfirm} onCancel={onDisableCancel} onClose={onDisableCancel} />
            </div>

        </>
    );
}

export default UserListActions;