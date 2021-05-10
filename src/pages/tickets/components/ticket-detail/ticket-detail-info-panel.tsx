import React from 'react';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import Collapsible from '../../../../shared/components/collapsible/collapsible';
import TicketDetailAssignee from './ticket-detail-assignee';
import TicketDetailPatientInfo from './ticket-detail-patient-info';
import TicketDetailAppointments from './ticket-detail-appointments';
import TicketDetailAttachments from './ticket-detail-attachments';
import TicketDetailEventLog from './ticket-detail-event-log';
import {Patient} from '@pages/patients/models/patient';
import {Contact} from '@shared/models/contact.model';
import TicketDetailContactInfo from '@pages/tickets/components/ticket-detail/ticket-detail-contact-info';
import TicketDetailTicketInfo from '@pages/tickets/components/ticket-detail/ticket-detail-ticket-info';

interface TicketDetailInfoPanelProps {
    ticket: Ticket,
    patient?: Patient,
    contact?: Contact
}

const TicketDetailInfoPanel = ({ticket, patient, contact}: TicketDetailInfoPanelProps) => {
    return <div>
        <div className='border-b'>
            <div className='px-6'>
                <Collapsible title={'ticket_detail.info_panel.ticket_info'} isOpen={true}>
                    <TicketDetailTicketInfo ticket={ticket}/>
                </Collapsible>
            </div>
        </div>
        <div className='px-6'>
            <Collapsible title={'ticket_detail.info_panel.assigned_to'} isOpen={true}>
                <TicketDetailAssignee ticket={ticket}/>
            </Collapsible>
        </div>
        <div className='border-b'>
            <div className='px-6'>
                {patient && <Collapsible title={'ticket_detail.info_panel.patient_info'} isOpen={true}>
                    <TicketDetailPatientInfo ticket={ticket} patient={patient}/>
                </Collapsible>}
                {patient && <Collapsible title={'ticket_detail.info_panel.appointments'} isOpen={true}>
                    <TicketDetailAppointments ticket={ticket}/>
                </Collapsible>}
                {contact && <Collapsible title={'ticket_detail.info_panel.contact_details.contact_info'} isOpen={true}>
                    <TicketDetailContactInfo contact={contact}/>
                </Collapsible>}
            </div>
        </div>
        <div className='border-b'>
            <div className='px-6'>
                <Collapsible title={'ticket_detail.info_panel.attachments'} isOpen={true}>
                    <TicketDetailAttachments ticket={ticket}/>
                </Collapsible>
            </div>
        </div>
        <div className='px-6'>
            <Collapsible title={'ticket_detail.info_panel.event_log'} isOpen={true}>
                <TicketDetailEventLog ticket={ticket}/>
            </Collapsible>
        </div>
    </div>
}

export default withErrorLogging(TicketDetailInfoPanel);
