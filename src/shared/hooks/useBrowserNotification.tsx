import {BrowserNotificationPermission} from "@shared/models/browser-notification-permission.enum";
import {selectAppUserDetails} from "@shared/store/app-user/appuser.selectors";
import {useSelector} from "react-redux";

const useBrowserNotification = () => {

    const appUserDetails = useSelector(selectAppUserDetails);

    const askNotificationPermission = () => {
        Notification.requestPermission(function () {
            notificationAllowedToBeDisplayed();
        });
    }

    const shouldPromptUserWithPopup = () => {
        if (typeof Notification === 'undefined') {
            return false;
        }
        const anyNotificationPreferenceToggledOn = appUserDetails?.chatNotification || appUserDetails?.callNotification || appUserDetails?.smsNotification
            || appUserDetails?.emailNotification;
        return Notification.permission === BrowserNotificationPermission.Default && anyNotificationPreferenceToggledOn;
    }

    const notificationAllowedToBeDisplayed = () => {
        if (typeof Notification === 'undefined') {
            return false;
        }
        switch (Notification.permission) {
            case BrowserNotificationPermission.Default:
                askNotificationPermission();
                return false;
            case BrowserNotificationPermission.Granted:
                return true;
            case BrowserNotificationPermission.Denied:
            default:
                return false;
        }
    }

    const displayNotification = (title: string, notificationOptions?: NotificationOptions, onClick?: () => void) => {
        if (notificationAllowedToBeDisplayed()) {
            const notification = new Notification(title, notificationOptions);
            notification.onclick = function () {window.focus(); if (onClick) {onClick()} };
        }
    }

    return {
        displayNotification,
        askNotificationPermission,
        shouldPromptUserWithPopup
    }
}

export default useBrowserNotification;