import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
import {useTranslation} from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import {useDispatch} from 'react-redux';
import {getEnumByType} from '../../services/tickets.service';
import TicketChannelIcon from '../ticket-channel-icon';
import '../../tickets.scss';
import './ticket-detail-header.scss';
import TicketDetailHeaderLine2 from '@pages/tickets/components/ticket-detail/ticket-detail-header-line-2';
import TicketDetailHeaderLine3 from '@pages/tickets/components/ticket-detail/ticket-detail-header-line-3';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {Contact} from '@shared/models/contact.model';

export interface TicketDetailHeaderProps {
    ticket: Ticket,
    patient?: ExtendedPatient
    contact?: Contact
}

const TicketDetailHeader = ({ticket, patient, contact}: TicketDetailHeaderProps) => {
    dayjs.extend(relativeTime)
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [patientOrContactName, setPatientOrContactName] = useState<string>('');

    useEffect(() => {
        dispatch(getEnumByType('TicketStatus'));
    }, [dispatch]);

    useEffect(() => {
        if (contact) {
            setPatientOrContactName(contact.companyName);
        } else if (patient) {
            setPatientOrContactName(`${patient.firstName} ${patient.lastName}`);
        }
    }, [contact, patient]);


    if (!ticket) {
        return <div data-test-id='ticket-detail-error'>{t('common.error')}</div>;
    }

    return <div className='pt-2 flex flex-col'>
        <div className='pl-6 h-16 flex flex-row items-center'>
            <div>
                <TicketChannelIcon channel={ticket.channel}/>
            </div>
            <h5 className='pl-3'><span className='ticket-detail-header-id'>{t('ticket_detail.header.id')}</span></h5>
            <h5 className='pl-2'>{ticket.ticketNumber}</h5>
            <h5 className='pl-4'>{ticket.subject}</h5>
        </div>
        <TicketDetailHeaderLine2 ticket={ticket} patientOrContactName={patientOrContactName}/>
        <div className='pt-6'>
            <TicketDetailHeaderLine3 ticket={ticket} patient={patient} contact={contact}/>
        </div>
    </div>;
}

export default withErrorLogging(TicketDetailHeader);
