import React from 'react';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import { Ticket } from '../../models/ticket';
import Collapsible from '../../../../shared/components/collapsible/collapsible';
import TicketInfo from './ticket-detail-ticket-info';
import TicketDetailAssignee from './ticket-detail-assignee';
import TicketDetailPatientInfo from './ticket-detail-patient-info';
import TicketDetailAppointments from './ticket-detail-appointments';
import TicketDetailAttachments from './ticket-detail-attachments';
import TicketDetailEventLog from './ticket-detail-event-log';

interface TicketDetailInfoPanelProps {
    ticket: Ticket
}

const TicketDetailInfoPanel = ({ ticket }: TicketDetailInfoPanelProps) => {
    return <div className='px-4'>
        <Collapsible title={'ticket_detail.info_panel.ticket_info'} isOpen={true}>
            <TicketInfo ticket={ticket} />
        </Collapsible>
        <Collapsible title={'ticket_detail.info_panel.assigned_to'} isOpen={true}>
            <TicketDetailAssignee ticket={ticket} />
        </Collapsible>
        <Collapsible title={'ticket_detail.info_panel.patient_info'} isOpen={true}>
            <TicketDetailPatientInfo ticket={ticket} />
        </Collapsible>
        <Collapsible title={'ticket_detail.info_panel.appointments'} isOpen={true}>
            <TicketDetailAppointments ticket={ticket} />
        </Collapsible>
        <Collapsible title={'ticket_detail.info_panel.attachments'} isOpen={true}>
            <TicketDetailAttachments ticket={ticket} />
        </Collapsible>
        <Collapsible title={'ticket_detail.info_panel.event_log'} isOpen={true}>
            <TicketDetailEventLog ticket={ticket} />
        </Collapsible>
    </div>
}

export default withErrorLogging(TicketDetailInfoPanel);
