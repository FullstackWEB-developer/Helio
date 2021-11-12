import {SmsNotificationData} from '@pages/sms/models';
import {appendUnreadSMSList} from '@shared/store/app-user/appuser.slice';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSignalRConnectionContext} from '../contexts/signalRContext';
import {TicketMessagesDirection} from '@shared/models';

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
        if (data.messageDirection === TicketMessagesDirection.Incoming) {
            dispatch(appendUnreadSMSList(data.ticketId));
        }
    }
    return null;
}

export default IncomingSmsUpdate;
