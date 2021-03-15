import React, {useEffect} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import { ReactComponent as ArrowBackIcon } from '../../../../shared/icons/Icon-Arrow-Back-24px.svg';
import { ReactComponent as ChannelEmailIcon } from '../../../../shared/icons/Icon-Channel-Email-48px.svg';
import { ReactComponent as RatingIcon } from '../../../../shared/icons/Icon-rating-very-satisfied-24px.svg';
import { Ticket } from '../../models/ticket';
import { Patient } from '../../../patients/models/patient';
import TicketStatus from '../ticket-status';
import { ReactComponent as PhoneIcon } from '../../../../shared/icons/Icon-Phone-White-24px.svg';
import { ReactComponent as SmsIcon } from '../../../../shared/icons/Icon-Sms-White-24px.svg';
import { ReactComponent as EmailIcon } from '../../../../shared/icons/Icon-Email-White-24px.svg';
import Button from '../../../../shared/components/button/button';
import { useDispatch, useSelector } from 'react-redux';
import { selectEnumValues } from '../../store/tickets.selectors';
import { getEnumByType, setStatus } from '../../services/tickets.service';
import { setTicket } from '../../store/tickets.slice';

interface TicketDetailHeaderProps {
    ticket: Ticket,
    patient: Patient
}

const TicketDetailHeader = ({ ticket, patient }: TicketDetailHeaderProps) => {
    dayjs.extend(relativeTime)
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const SmallLabel = (text: string, value: string | undefined) => {
        return (
            <div className='pt-6'>
                <div className='flex flex-row'>
                    <div>{t(text)}</div>
                    <h6 className='pl-2 pt-1'>{value}</h6>
                </div>
            </div>
        )
    }

    const ticketStatuses = useSelector((state => selectEnumValues(state, 'TicketStatus')))
    useEffect(() => {
        dispatch(getEnumByType('TicketStatus'));
    }, [dispatch]);

    const updateStatus = async (statusValue: string) => {
        const statusKey = ticketStatuses ? ticketStatuses.find((s) => s.value === statusValue)?.key : null;
        if (ticket && ticket.id && statusKey) {
            dispatch(setStatus(ticket.id, statusKey));
            dispatch(setTicket({status: statusKey}));
        }
    }

    return ticket ? (
        <div>
            <div className={'flex flex-row p-8'}>
                <div className={'pl-4 pt-4 cursor-pointer align-middle'} onClick={() => history.push('/my_tickets')}><ArrowBackIcon/></div>
                <ChannelEmailIcon className={'mt-1 ml-2 h-12 w-12'}/>

                <div className={'pl-8 pt-4'}>
                    <div className={'flex flex-row text-2xl'}>
                        <span className={'font-bold'}>{t('ticket_detail.header.id')} {ticket.ticketNumber} {ticket.subject || ''} </span>
                    </div>
                    <div className={'flex flex-row text-xl'}>
                        <div className='flex space-x-10'>
                            {
                                <TicketStatus ticketId={ticket.id || ''} status={ticket.status} />
                            }
                            {
                                SmallLabel('ticket_detail.header.requested_by', patient ? `${patient.firstName} ${patient.lastName}` : ticket.patientId)
                            }
                            {
                                SmallLabel('ticket_detail.header.due_in', ticket.dueDate ? dayjs().to(dayjs(ticket.dueDate)) : '')
                            }
                            {
                                SmallLabel('ticket_detail.header.last_message', ticket.createdOn ? dayjs().to(dayjs(ticket.createdOn)) : '') // TODO: use date from feed
                            }
                            {
                                <RatingIcon className={'h-12 w-12'}/>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className={'flex flex-row'}>
                <div className='flex flex-row w-full pt-2 pb-2 border-t border-b'>
                    <div className='flex justify-items-start w-1/2'>
                        <div className='pl-20'>
                            <PhoneIcon className='cursor-pointer bg-gray-800 rounded-md h-10 w-16 p-1' />
                        </div>
                        <div className='pl-5'>
                            <SmsIcon className='cursor-pointer bg-gray-800 rounded-md h-10 w-16 p-1' />
                        </div>
                        <div className='pl-5'>
                            <EmailIcon className='cursor-pointer bg-gray-800 rounded-md h-10 w-16 p-1' />
                        </div>
                    </div>
                    <div className='flex justify-end w-1/2'>
                        <div className='pr-3'>
                            <Button data-test-id='ticket-detail-header-archive-button'
                                    buttonType='secondary'
                                    label={'ticket_detail.header.archive'} />
                        </div>
                        <div className='pr-3'>
                            <Button data-test-id='ticket-detail-header-solved-button'
                                    buttonType='small'
                                    onClick={() => updateStatus('Solved')}
                                    label={'ticket_detail.header.solved'} />
                        </div>
                        <div className='pr-10'>
                            <Button data-test-id='ticket-detail-header-close-button'
                                    buttonType='small'
                                    onClick={() => updateStatus('Closed')}
                                    label={'ticket_detail.header.close'} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : <div data-test-id='ticket-detail-error'>{t('common.error')}</div>;
}

export default withErrorLogging(TicketDetailHeader);
