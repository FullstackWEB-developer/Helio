import {useTranslation} from 'react-i18next';
import Input from '@components/input';
import NotificationTemplateSelect from '@components/notification-template-select/notification-template-select';
import {NotificationTemplate, NotificationTemplateChannel} from '@shared/models/notification-template.model';
import TextArea from '@components/textarea/textarea';
import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from 'react-query';
import {sendMessage} from '@pages/sms/services/ticket-messages.service';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {useDispatch, useSelector} from 'react-redux';
import {ChannelTypes, TicketMessagesDirection} from '@shared/models';
import Button from '@components/button/button';
import './sms-context.scss';
import {selectBotContext} from '@pages/ccp/store/ccp.selectors';
import ParentExtraTemplate from '@components/notification-template-select/components/parent-extra-template';
import {ProcessTemplate} from '@constants/react-query-constants';
import utils from '@shared/utils/utils';
import {processTemplate} from '@shared/services/notifications.service';

const SmsContext = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const botContext = useSelector(selectBotContext);
    const [smsText, setSmsText] = useState<string>('');
    const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate>();
    const [patientName, setPatientName] = useState<string>('');

    useEffect(() => {
        if (botContext?.patient) {
            setPatientName(utils.stringJoin(' ',botContext.patient.firstName, botContext.patient.lastName));
        }
    }, [botContext?.patient])

    const{isFetching: isProcessing} = useQuery([ProcessTemplate, selectedTemplate?.id!], () =>
            processTemplate(selectedTemplate?.id!, botContext.ticket!, botContext.patient),
        {
            enabled: !!botContext && botContext.ticket && !!selectedTemplate?.requirePreProcessing,
            onSuccess: (data) => {
                setSmsText(data.content);
            }
        });

    const templateSelected = (template: NotificationTemplate) => {
        setSelectedTemplate(template);
        if (!template.requirePreProcessing) {
            setSmsText(template.content);
        }
    }

    const sendSmsMutation = useMutation(sendMessage, {
        onSuccess: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'ticket_detail.sms_send_success'
            }));
            setSmsText('');
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'ticket_detail.sms_send_fail'
            }));
        }
    });

    const sendSms = async () => {
        if (botContext.ticket?.id && botContext.patient?.mobilePhone) {
            sendSmsMutation.mutate({
                body: smsText,
                ticketId: botContext.ticket?.id,
                channel: ChannelTypes.SMS,
                toAddress: botContext.patient.mobilePhone,
                recipientName: patientName,
                direction: TicketMessagesDirection.Outgoing
            });
        }
    }

    return <div className='overflow-y-auto sms-container pb-6'>
        <div className='px-6 flex flex-col'>
            <div className='flex items-center h7 h-12'>{t('ccp.sms_context.title')}</div>
            <div className='flex flex-col'>
                    <div className='pt-4 w-4/5'>
                        <Input disabled={true} name='to' value={patientName} label='ccp.sms_context.to'/>
                    </div>
                    <div className='w-4/5'>
                        <NotificationTemplateSelect selectLabel='ccp.sms_context.select_template'
                                                    asSelect={true}
                                                    channel={NotificationTemplateChannel.Sms}
                                                    onSelect={templateSelected}/>
                    </div>
                {
                    selectedTemplate &&
                <div>
                    <ParentExtraTemplate parentType='ccp' logicKey={selectedTemplate?.logicKey} patient={botContext?.patient}/>
                </div>
                }
                    <div>
                        <TextArea
                            className='body2 w-full'
                            data-test-id='note-context-notes'
                            value={smsText}
                            required={true}
                            rows={3}
                            minRows={6}
                            resizable={false}
                            disabled={!(!!botContext?.patient?.mobilePhone)}
                            hasBorder={true}
                            label='ccp.sms_context.message'
                            onChange={(message) => setSmsText(message)}
                        />
                    </div>
                    <div className='flex flex-row space-x-4 pt-6'>
                        <div>
                            <Button buttonType='secondary' label='ccp.sms_context.preview'/>
                        </div>
                        <div>
                            <Button buttonType='small' label='ccp.sms_context.send' onClick={sendSms}
                                    disabled={(!(!!botContext?.patient?.mobilePhone)) || isProcessing}
                                    isLoading={sendSmsMutation.isLoading}/>
                        </div>
                    </div>
                </div>
        </div>
    </div>
}

export default SmsContext;
