import {SmsNotificationData} from '@pages/sms/models';
import {appendUnreadSMSList} from '@shared/store/app-user/appuser.slice';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSignalRConnectionContext} from '../contexts/signalRContext';

const IncomingSmsUpdate = () => {

    const {smsIncoming} = useSignalRConnectionContext();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!smsIncoming) {
            return () => { };
        }

        smsIncoming.on('ReceiveSmsMessage', onSMSReceived);
        return () => {
            smsIncoming?.off('ReceiveSmsMessage', onSMSReceived);
        }
    }, [smsIncoming]);

    const onSMSReceived = (data: SmsNotificationData) => {
        dispatch(appendUnreadSMSList(data.ticketId));
    }
    return null;
}

export default IncomingSmsUpdate;