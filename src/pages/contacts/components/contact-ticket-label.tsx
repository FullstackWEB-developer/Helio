import React from 'react';
import withErrorLogging from '../../../shared/HOC/with-error-logging';

interface PatientTicketLabelProps {
    labelText: string;
    valueText: string;
    isDanger?: boolean;
}
const PatientTicketLabel: React.FC<PatientTicketLabelProps> = ({labelText, valueText, isDanger}) => {
    return (
        <>
            <span className='pr-1 subtitle3-small contact-ticket-label'>{labelText}</span>
            <span className={`pr-3 body3 contact-ticket-label ${isDanger ? 'text-danger' : ''}`}>{valueText}</span>
        </>
    )
}
export default withErrorLogging(PatientTicketLabel);
