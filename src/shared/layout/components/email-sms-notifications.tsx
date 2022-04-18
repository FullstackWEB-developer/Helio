import {useEffect} from 'react';
import useBrowserNotification from '@shared/hooks/useBrowserNotification';
import {useQuery} from 'react-query';
import {GetEmailsForNotifications, GetSmsForNotifications} from '@constants/react-query-constants';
import {getChats} from '@pages/sms/services/ticket-messages.service';
import {ChannelTypes} from '@shared/models';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import {useSelector} from 'react-redux';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import utils from '@shared/utils/utils';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import dayjs from 'dayjs';

const EmailSmsNotifications = () => {
    const {displayNotification} = useBrowserNotification();
    const user = useSelector(selectAppUserDetails);
    const emailTeamView = useCheckPermission('Email.DefaultToTeamView');
    const smsTeamView = useCheckPermission('SMS.DefaultToTeamView');
    const {t} = useTranslation();
    const history = useHistory();
    const intervalTime = utils.getAppParameter('BrowserNotificationThresholdInMinutes') * 1000 * 60;


    const emailQuery = useQuery(GetEmailsForNotifications, () => getChats({
        channel: ChannelTypes.Email,
        pageSize:100,
        page:1,
        assignedTo:emailTeamView ? undefined : user.id,
        fromDate: dayjs.utc().add(intervalTime * -1, 'minutes').toDate().toISOString()
    }), {
        enabled: false,
        onSuccess: (data) => {
            const unread  =data.results.find(a => a.unreadCount > 0);
            if (unread) {
                dispatchNotifications('email');
            }
        }
    });

    const smsQuery = useQuery(GetSmsForNotifications, () => getChats({
        channel: ChannelTypes.SMS,
        pageSize:100,
        page:1,
        assignedTo:smsTeamView ? undefined : user.id,
        fromDate: dayjs.utc().add(intervalTime * -1, 'minutes').toDate().toISOString()
    }), {
        enabled: false,
        onSuccess: (data) => {
            const unread  =data.results.find(a => a.unreadCount > 0);
            if (unread) {
                dispatchNotifications('sms');
            }
        }
    });

    const dispatchNotifications = (type: 'sms' | 'email') => {
        const icon = `${utils.getAppParameter('NotificationIconsLocation')}notification-${type}.png`;
        const notification: NotificationOptions = {
            body: t(`browser_notifications.have_unread_${type}_body`),
            tag: String(Date.now()),
            icon
        };
        displayNotification(t(`browser_notifications.have_unread_${type}`), notification, () => history.push(`/${type}`));
    }


    useEffect(() => {
        const interval = setInterval(() => {
            if (user?.emailNotification) {
                emailQuery.refetch().then();
            }
            if (user?.smsNotification) {
                smsQuery.refetch().then();
            }
        }, intervalTime);

        return () => clearInterval(interval);
    }, [user]);

    return null;
}

export default EmailSmsNotifications;
