import React, {useEffect} from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router';
import {useTranslation} from 'react-i18next';
import withErrorLogging from '@shared/HOC/with-error-logging';
import ThreeDots from '@shared/components/skeleton-loader/skeleton-loader';
import TicketDetailHeader from './components/ticket-detail/ticket-detail-header';
import TicketInfoPanel from './components/ticket-detail/ticket-detail-info-panel';
import TicketDetailFeed from './components/ticket-detail/ticket-detail-feed';
import TicketDetailAddNote from './components/ticket-detail/ticket-detail-add-note';
import {Ticket} from './models/ticket';
import {useQuery} from 'react-query';
import {getTicketByNumber} from './services/tickets.service';
import {GetContactById, QueryGetPatientById, QueryTickets} from '@constants/react-query-constants';
import {setTicket} from './store/tickets.slice';
import {selectSelectedTicket} from '@pages/tickets/store/tickets.selectors';
import {getPatientByIdWithQuery} from '@pages/patients/services/patients.service';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {Contact} from '@shared/models/contact.model';
import {getContactById} from '@shared/services/contacts.service';

interface TicketParams {
    ticketNumber: string
}

const TicketDetail = () => {
    dayjs.extend(utc);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const {ticketNumber} = useParams<TicketParams>();
    const ticket = useSelector(selectSelectedTicket);
    const feedsRef = React.useRef<HTMLDivElement | null>();
    const {isLoading, error, isFetching} = useQuery<Ticket, Error>([QueryTickets, ticketNumber], () =>
            getTicketByNumber(Number(ticketNumber)),
        {
            refetchOnMount: 'always',
            onSuccess: data => {
                dispatch(setTicket(data))
            }
        }
    );

    const {
        refetch: patientRefetch,
        data: patient
    } = useQuery<ExtendedPatient, Error>([QueryGetPatientById, ticket?.patientId], () =>
            getPatientByIdWithQuery(ticket.patientId as number),
        {
            enabled: false
        }
    );

    const {refetch: contactRefetch, data: contact} = useQuery<Contact, Error>([GetContactById, ticket?.contactId], () =>
            getContactById(ticket.contactId!),
        {
            enabled: false
        }
    );

    useEffect(() => {
        if (ticket?.patientId) {
            patientRefetch();
        }
    }, [patientRefetch, ticket?.patientId]);

    useEffect(() => {
        if (ticket?.contactId) {
            contactRefetch();
        }
    }, [contactRefetch, ticket?.contactId]);

    if (isLoading || isFetching) {
        return <ThreeDots/>;
    }

    if (error) {
        return <div data-test-id='ticket-detail-error'>{t('common.error')}</div>
    }

    if (!ticket) {
        return null;
    }
    const onNoteAdded = () => {
        feedsRef.current?.scrollIntoView({
            block: 'start',
            behavior: 'smooth'
        });
    }

    return (
        <div className='flex w-full'>
            <div className='w-3/4 relative flex flex-col'>
                <TicketDetailHeader ticket={ticket} contact={contact} patient={patient}/>
                <div className='mb-auto flex-1'>
                    <TicketDetailFeed ticket={ticket} ref={(ref) => feedsRef.current = ref}/>
                </div>
                <div className=''>
                    <TicketDetailAddNote onNoteAdded={() => onNoteAdded()} ticket={ticket}/>
                </div>
            </div>
            <div className='w-1/4 border-l overflow-y-auto'>
                <TicketInfoPanel ticket={ticket} patient={patient} contact={contact}/>
            </div>
        </div>
    );
}

export default withErrorLogging(TicketDetail);
