import React, {Fragment} from 'react';
import withErrorLogging from '@shared/HOC/with-error-logging';
import {useTranslation} from 'react-i18next';
import {PatientTicketsRequest} from '../../tickets/models/patient-tickets-request';
import {DefaultPagination} from '@shared/models/paging.model';
import {getPatientTickets} from '../../tickets/services/tickets.service';
import TicketChannelTypeIcon from '../../tickets/components/ticket-channel-type-icon';
import utils from '@shared/utils/utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useQuery} from 'react-query';
import {TicketBase} from '../../tickets/models/ticket-base';
import PatientTicketLabel from './patient-ticket-label';
import {TicketsPath} from '@app/paths';
import {OneMinute, QueryPatientTickets} from '@constants/react-query-constants';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import TicketStatusDot from '@pages/tickets/components/ticket-status-dot';
import Spinner from '@components/spinner/Spinner';
import { Link } from 'react-router-dom';
import './patient-tickets.scss';

interface PatientTicketProps {
    patientId: number;
}

const PatientTickets: React.FC<PatientTicketProps> = ({patientId}) => {

    const {t} = useTranslation();
    dayjs.extend(relativeTime);
    const sysdate = Date.now();

    const query: PatientTicketsRequest = {
        patientId,
        ...DefaultPagination,
        pageSize: 10
    }

    const {isLoading, error, data: items} = useQuery<TicketBase[], Error>([QueryPatientTickets, query], () =>
            getPatientTickets(query),
        {
            staleTime: OneMinute
        }
    );

   
    return <Fragment>
        {
            isLoading ? <Spinner fullScreen/>
                : (
                    <Fragment>

                            <div className={'py-3 align-middle border-b flex items-center'}>
                                <Link to={`${TicketsPath}/new?patientId=${patientId}`} className='inline-flex cursor-pointer block items-center'>
                                <SvgIcon type={Icon.Add}
                                         className='icon-medium'
                                         fillClass='active-item-icon'/>
                                    <div className='pl-2 body2'>{t('patient.create_ticket')}</div>
                                </Link>
                            </div>
                        {
                            error && <div className={'pt-4 text-red-500'}>{t('common.error')}</div>
                        }

                        <div className='patient-tickets-container overflow-y-auto'>{
                            items && items?.map(item => {
                                return (
                                    <Link to={`${TicketsPath}/${item.ticketNumber}`}>
                                        <div className={'py-4 border-b cursor-pointer'} key={item.id}>
                                            <div className='flex flex-row body2'>
                                                <TicketChannelTypeIcon channel={item.channel} fillClass='rgba-03-fill' />
                                                <span className="mx-2">{item.ticketNumber}</span>
                                                <span className='flex-auto subtitle2'>{item.subject}</span>
                                                {item.status && (
                                                    <div className='flex flex-row items-center w-36 '>
                                                        <div>
                                                            <TicketStatusDot ticket={item}/>
                                                        </div>
                                                        <div className='pl-3 subtitle3'>
                                                            {item.status && t(`tickets.statuses.${(item.status)}`)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className='flex flex-row body2'>
                                                {item.dueDate && (
                                                    <PatientTicketLabel labelText={t('tickets.overdue')}
                                                        valueText={dayjs().to(dayjs(item.dueDate))}
                                                        isDanger={dayjs(item.dueDate).isBefore(sysdate)} />
                                                )}
                                                {item.closedOn && (
                                                    <PatientTicketLabel labelText={t('tickets.closed')} valueText={utils.formatUtcDate(item.closedOn, 'MMM D, YYYY h:mm A')} />
                                                )}
                                                {item.createdOn && (
                                                    <PatientTicketLabel labelText={t('tickets.created')} valueText={utils.formatUtcDate(item.createdOn, 'MMM D, YYYY h:mm A')} />
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                        </div>
                    </Fragment>
                )
        }
    </Fragment>
}

export default withErrorLogging(PatientTickets);
