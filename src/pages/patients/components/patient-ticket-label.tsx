import React, {Fragment} from 'react';
import withErrorLogging from '../../../shared/HOC/with-error-logging';

interface PatientTicketLabelProps {
    labelText: string;
    valueText: string;
    isDanger?: boolean;
}
const PatientTicketLabel: React.FC<PatientTicketLabelProps> = ({ labelText, valueText, isDanger }) => {
    return (
        <Fragment>
            <span className='pr-1 body2-medium'> {labelText}</span>
            <span className={`pr-3 ${isDanger ? 'text-danger' : ''}`}>{valueText}</span>
        </Fragment>
    )
}

export default withErrorLogging(PatientTicketLabel);