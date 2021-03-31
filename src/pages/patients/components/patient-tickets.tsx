import React, {Fragment} from 'react';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import {useTranslation} from 'react-i18next';
import {PatientTicketsRequest} from '../../tickets/models/patient-tickets-request';
import {DefaultPagination} from '../../../shared/models/paging.model';
import {getPatientTickets} from '../../tickets/services/tickets.service';
import ThreeDots from '../../../shared/components/skeleton-loader/skeleton-loader';
import {ReactComponent as AddIcon} from '../../../shared/icons/Icon-Add-Black-24px.svg';
import {useHistory} from 'react-router-dom';
import TicketChannelTypeIcon from '../../tickets/components/ticket-channel-type-icon';
import utils from '../../../shared/utils/utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useQuery} from 'react-query';
import {TicketBase} from '../../tickets/models/ticket-base';
import PatientTicketLabel from './patient-ticket-label';
import TicketStatusDisplay from '../../tickets/components/ticket-status-display';
import {TicketsPath} from '../../../app/paths';

interface PatientTicketProps {
    patientId: number;
}

const PatientTickets: React.FC<PatientTicketProps> = ({patientId}) => {

    const history = useHistory();
    const {t} = useTranslation();
    dayjs.extend(relativeTime);
    const sysdate = Date.now();

    const query: PatientTicketsRequest = {
        patientId,
        ...DefaultPagination,
        pageSize: 10
    }

    const {isLoading, error, data: items} = useQuery<TicketBase[], Error>(["patientTickets", query], () =>
            getPatientTickets(query),
        {
            staleTime: 60000
        }
    );

   
    return <Fragment>
        {
            isLoading ? <ThreeDots/>
                : (
                    <Fragment>
                        <div className={'py-3 cursor-pointer align-middle border-b'}
                             onClick={() => history.push(`${TicketsPath}/new?patientId=${patientId}`)}><AddIcon/></div>
                        {
                            error && <div className={'pt-4 text-red-500'}>{t('common.error')}</div>
                        }
                        {
                            items && items?.map(item => {
                                return (
                                    <div className={'py-4 border-b cursor-pointer'}
                                         onClick={() => history.push(`${TicketsPath}/${item.ticketNumber}`)} key={item.id}>
                                        <div className='flex flex-row body2'>
                                            <TicketChannelTypeIcon channel={item.channel} />
                                            <span className="mx-2">{item.ticketNumber}</span>
                                            <span className='flex-auto subtitle2'>{item.subject}</span>
                                            {item.status && (
                                                <div className='flex w-36 subtitle3'>
                                                    <TicketStatusDisplay status={item.status} iconClass='w-5 mt-0.5'/>
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
                                                <PatientTicketLabel labelText={t('tickets.closed')} valueText={utils.formatDate12HoursTime(item.closedOn)} />
                                            )}
                                            {item.createdOn && (
                                                <PatientTicketLabel labelText={t('tickets.created')} valueText={utils.formatDate12HoursTime(item.createdOn)} />
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Fragment>
                )
        }
    </Fragment>
}

export default withErrorLogging(PatientTickets);
