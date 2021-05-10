import ContactInformation from './contact-information';
import OutstandingBalances from './outstanding-balances';
import Appointments from './appointments';
import {PatientChartSummary} from '@pages/patients/models/patient-chart-summary';

export interface PatientSummaryProps {
    patientChartSummary: PatientChartSummary;
}

const PatientSummary = ({patientChartSummary} : PatientSummaryProps) => {
    return (<>
            <ContactInformation/>
            <OutstandingBalances patientChartSummary={patientChartSummary}/>
                <Appointments patientChartSummary={patientChartSummary} />
            </>
    );
};

export default PatientSummary;
