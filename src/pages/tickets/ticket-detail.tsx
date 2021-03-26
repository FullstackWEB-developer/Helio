import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import withErrorLogging from '../../shared/HOC/with-error-logging';
import { selectTicketById, selectTicketOptionsError, selectTicketsLoading } from './store/tickets.selectors';
import ThreeDots from '../../shared/components/skeleton-loader/skeleton-loader';
import TicketDetailHeader from './components/ticket-detail/ticket-detail-header';
import TicketInfoPanel from './components/ticket-detail/ticket-detail-info-panel';
import TicketDetailFeed from './components/ticket-detail/ticket-detail-feed';
import TicketDetailAddNote from './components/ticket-detail/ticket-detail-add-note';
import { selectPatient } from '../patients/store/patients.selectors';
import {getPatientById} from '../../shared/services/search.service';

interface TicketParams {
    ticketId: string
}

const TicketDetail = () => {
    dayjs.extend(utc);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { ticketId } = useParams<TicketParams>();

    const error = useSelector(selectTicketOptionsError);
    const isLoading = useSelector(selectTicketsLoading)
    const ticket = useSelector((state) => selectTicketById(state, ticketId));
    const patient = useSelector(selectPatient);

    useEffect(() => {
        if (ticket?.patientId){
            dispatch(getPatientById(ticket.patientId));
        }
    }, [dispatch, ticket]);

    if (isLoading) {
        return <ThreeDots />;
    }

    if (error) {
        return <div data-test-id='ticket-detail-error'>{t('common.error')}</div>
    }

    return (
        <div className='flex w-full'>
            <div className='w-3/4 relative'>
                <TicketDetailHeader ticket={ticket} patient={patient}/>
                <TicketDetailFeed ticket={ticket}/>
                <div className='absolute bottom-0 w-full'>
                    <TicketDetailAddNote ticket={ticket}/>
                </div>
            </div>
            <div className='w-1/4 border-l pt-12 px-2 overflow-y-auto'>
                <TicketInfoPanel ticket={ticket}/>
            </div>
        </div>
    );
}

export default withErrorLogging(TicketDetail);
