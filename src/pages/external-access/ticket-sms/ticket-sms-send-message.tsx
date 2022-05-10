import TextArea from '@components/textarea/textarea';
import {Icon} from '@components/svg-icon';
import React, {useState} from 'react';
import {useMutation} from 'react-query';
import {createTicketMessage} from '@pages/sms/services/ticket-messages.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import {ChannelTypes, TicketMessagesDirection} from '@shared/models';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import {getContactById} from '@shared/services/contacts.service';
import {selectExternalUserPhoneNumber} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import {useQuery} from 'react-query';
import {
    GetContactById,
    GetPatient
} from '@constants/react-query-constants';
interface TicketSmsSendMessageProps {
    ticketId: string,
    patientId?: number,
    contactId?: string,
    onMessageSend: (text: string) => void;
}

const TicketSmsSendMessage = ({ticketId, patientId, contactId, onMessageSend}: TicketSmsSendMessageProps) => {

    const {t} = useTranslation();
    const [smsText, setSmsText] = useState<string>('');
    const mobilePhone = useSelector(selectExternalUserPhoneNumber);
    const dispatch = useDispatch();
    const createTicketSmsMutation = useMutation(createTicketMessage, {
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'external_access.ticket_sms.sms_sent_failed',
                position: SnackbarPosition.TopCenter
            }))},
        onSuccess: () => {
            onMessageSend(smsText);
            setSmsText('');
        }
    });

    const {refetch: refetchPatient} = useQuery([GetPatient, patientId], () => getPatientByIdWithQuery(patientId!), {
        enabled: false,
         onSuccess: (data) => {
            checkMobilePhoneStatus(data.mobilePhone);
        }
    });

    const {refetch: refetchContact} = useQuery([GetContactById, contactId], () => getContactById(contactId!), {
        enabled: false,
        onSuccess: (data) => {
            checkMobilePhoneStatus(data.mobilePhone);
        }
    });

    const sendSms = () => {
        if (!!smsText) {
            if(patientId){
                refetchPatient();
            }else if(contactId){
                refetchContact();
            }
        } else {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Info,
                message: 'external_access.ticket_sms.no_empty_message',
                position: SnackbarPosition.TopCenter
            }));
        }
    }

    const checkMobilePhoneStatus = (mobilePhoneNumber) => {
        if(mobilePhoneNumber !== mobilePhone){
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'external_access.mobile_phone_changed'
            }))
        }else{
            createTicketSmsMutation.mutate({
                body: smsText,
                ticketId,
                direction: TicketMessagesDirection.Incoming,
                channel: ChannelTypes.SMS
            });
        }
    }

    return <div className='border-t flex flex-none fixed left-0 bottom-0 w-full'>
        <TextArea
            className='body2 w-full overflow-y-hidden'
            placeHolder={t('external_access.ticket_sms.type')}
            value={smsText}
            required={true}
            minRows={1}
            maxRows={1}
            isLoading={createTicketSmsMutation.isLoading}
            resizable={false}
            hasBorder={false}
            onChange={(message) => setSmsText(message)}
            iconClassNames='icon-medium'
            icon={Icon.Send}
            iconFill='rgba-06-fill'
            iconOnClick={() => sendSms()}
            alwaysDisplayIcon={true}
        />
    </div>;
}

export default TicketSmsSendMessage;
