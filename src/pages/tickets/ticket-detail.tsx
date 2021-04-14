import React, {useEffect} from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import withErrorLogging from '@shared/HOC/with-error-logging';
import ThreeDots from '@shared/components/skeleton-loader/skeleton-loader';
import TicketDetailHeader from './components/ticket-detail/ticket-detail-header';
import TicketInfoPanel from './components/ticket-detail/ticket-detail-info-panel';
import TicketDetailFeed from './components/ticket-detail/ticket-detail-feed';
import TicketDetailAddNote from './components/ticket-detail/ticket-detail-add-note';
import { Ticket } from './models/ticket';
import { useQuery } from 'react-query';
import { getTicketByNumber } from './services/tickets.service';
import {QueryGetPatientById, QueryTickets} from '@constants/react-query-constants';
import { setTicket } from './store/tickets.slice';
import {selectSelectedTicket} from '@pages/tickets/store/tickets.selectors';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import {Patient} from '@pages/patients/models/patient';

interface TicketParams {
    ticketNumber: string
}

const TicketDetail = () => {
    dayjs.extend(utc);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { ticketNumber } = useParams<TicketParams>();
    const ticket = useSelector(selectSelectedTicket);

    const { isLoading, error, isFetching } = useQuery<Ticket, Error>([QueryTickets, ticketNumber], () =>
        getTicketByNumber(Number(ticketNumber)),
        {
            refetchOnMount: 'always',
            onSuccess: data => {
                dispatch(setTicket(data))
            }
        }
    );

    const { refetch, data: patient} = useQuery<Patient, Error>([QueryGetPatientById, ticket?.patientId], () =>
        getPatientByIdWithQuery(ticket.patientId as number),
        {
            enabled: false
        }
    );
    
    useEffect(() => {
        if (ticket?.patientId) {
            refetch();
        }
    }, [refetch, ticket?.patientId]);

    if (isLoading || isFetching) {
        return <ThreeDots />;
    }

    if (error) {
        return <div data-test-id='ticket-detail-error'>{t('common.error')}</div>
    }

    if(!ticket) {
        return null;
    } 

    return (        
        <div className='flex w-full'>
            <div className='w-3/4 relative'>
                <TicketDetailHeader ticket={ticket} patient={patient} />
                <TicketDetailFeed ticket={ticket} />
                <div className='absolute bottom-0 w-full'>
                    <TicketDetailAddNote ticket={ticket} />
                </div>
            </div>
            <div className='w-1/4 border-l pt-12 px-2 overflow-y-auto'>
                <TicketInfoPanel ticket={ticket} patient={patient}/>
            </div>
        </div>
    );
}

export default withErrorLogging(TicketDetail);
