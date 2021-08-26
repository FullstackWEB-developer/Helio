import TextArea from '@components/textarea/textarea';
import {Icon} from '@components/svg-icon';
import React, {useState} from 'react';
import {useMutation,} from 'react-query';
import {createTicketMessage} from '@pages/sms/services/ticket-messages.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import {TicketMessagesDirection} from '@shared/models';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';

interface TicketSmsSendMessageProps {
    ticketId: string,
    onMessageSend: (text: string) => void;
}

const TicketSmsSendMessage = ({ticketId, onMessageSend}: TicketSmsSendMessageProps) => {

    const {t} = useTranslation();
    const [smsText, setSmsText] = useState<string>('');
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

    const sendSms = () => {
        if (!!smsText) {
            createTicketSmsMutation.mutate({
                smsMessage: {
                    messageBody: smsText
                },
                ticket: {
                    id: ticketId
                },
                direction: TicketMessagesDirection.Incoming
            });
        } else {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Info,
                message: 'external_access.ticket_sms.no_empty_message',
                position: SnackbarPosition.TopCenter
            }));
        }
    }

    return <div className='border-t flex flex-none'>
        <TextArea
            className='body2 w-full'
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
