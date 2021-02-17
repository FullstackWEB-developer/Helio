import {useSelector} from "react-redux";
import { selectPatientChartSummary } from "../../store/patients.selectors";
import {useTranslation} from "react-i18next";
import Table, {Row} from "../../../../shared/components/table/table";
import utils from "../../../../shared/utils/utils";
import AppointmentDisplay from "../appointment";

const Appointments = () => {
    const {t} = useTranslation();
    const patientChartSummary = useSelector(selectPatientChartSummary);

    const recentPatientsCases: Row[] = [];

    patientChartSummary.patientCases.forEach(patientCase => {
            recentPatientsCases.push(
                {label: utils.formatDate(patientCase.createdDate), values:[patientCase.subject]}
            )
        }
    );

    return (
        <div className="grid grid-cols-2 gap-12 pt-8">
            <div>
                <div className="font-bold text-lg border-b pb-1">{t('patient.summary.appointments')}</div>
                <div>
                    <div className="text-gray-400 pt-6 pb-3">{t('patient.summary.last_appointment')}</div>
                    { patientChartSummary.lastAppointment && <AppointmentDisplay appointment={patientChartSummary.lastAppointment}/>}
                    <div className="text-gray-400 pt-6 pb-3">{t('patient.summary.upcoming_appointment')}</div>
                    { patientChartSummary.upcomingAppointment && <AppointmentDisplay appointment={patientChartSummary.upcomingAppointment} />}
                </div>
            </div>
            <div>
                <div className="font-bold text-lg border-b pb-1">{t('patient.summary.recent_patient_cases')}</div>
                <div className="pt-3">
                    <Table headings={[t('patient.summary.date'), t('patient.summary.case_description')]}
                           rows={recentPatientsCases} dividerLine={true}/>
                </div>
            </div>
        </div>
    );
};

export default Appointments;
