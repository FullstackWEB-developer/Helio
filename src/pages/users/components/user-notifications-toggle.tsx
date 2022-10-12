import Spinner from '@components/spinner/Spinner';
import ToggleSwitch from '@components/toggle-switch/toggle-switch';
import {UserNotificationPreferences} from '@shared/models/user-notification-preferences.enum';
import classNames from 'classnames';
import React from 'react';
import {useTranslation} from 'react-i18next';
interface UserNotificationPreferenceProps {
    isChecked: boolean;
    onSwitch: (checked: boolean, notificationType: UserNotificationPreferences) => void
    notificationType: UserNotificationPreferences;
    mutationRunningForType?: UserNotificationPreferences;
    isLoading: boolean;
    hasBottomBorder?: boolean;
    name?: string;
}

const UserNotificationPreference = ({isChecked, onSwitch, notificationType, mutationRunningForType, isLoading, hasBottomBorder = false, name = "switch"}: UserNotificationPreferenceProps) => {
    const {t} = useTranslation();
    const handleToggleSwitch = (checked: boolean) => {
        onSwitch(checked, notificationType);
    }
    const showSpinner = isLoading && mutationRunningForType === notificationType;
    const className = classNames('border-t flex justify-between py-3', {'border-b': hasBottomBorder, 'pr-12': !showSpinner})
    return (
        <div className={className}>
            <span>{t(`browser_notifications.${notificationType}`)}</span>
            <div className='flex'>
                <ToggleSwitch name={name} isChecked={isChecked} onSwitch={handleToggleSwitch} disabled={isLoading} />
                {
                    showSpinner && <Spinner className='px-4' size='small' />
                }
            </div>
        </div>
    )
}

export default UserNotificationPreference;