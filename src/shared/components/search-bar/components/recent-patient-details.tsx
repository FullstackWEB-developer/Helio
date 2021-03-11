import { RecentPatient } from '../models/recent-patient';
import { useTranslation } from 'react-i18next';
import withErrorLogging from '../../../HOC/with-error-logging';
interface RecentPatientProps {
    patient: RecentPatient
}
const RecentPatientDetails = ({ patient }: RecentPatientProps) => {
    const { t } = useTranslation();
    return (
        <div className={'px-4 py-2 w-full cursor-pointer'} key={patient.patientId}>
            <span>
                <p>{`${patient.lastName}, ${patient.firstName}`}</p>
                <p>{`${patient.age} ${t('search.yearsOld')} X | ${patient.dob} | #${patient.patientId}`}</p>
            </span>
        </div>
    )
}

export default withErrorLogging(RecentPatientDetails);
