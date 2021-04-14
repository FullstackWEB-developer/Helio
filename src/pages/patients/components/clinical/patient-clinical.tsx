import Appointments from './appointments';
import RecentPatientCases from './recent-patient-cases';
import { useTranslation } from 'react-i18next';
import ThreeDots from '../../../../shared/components/skeleton-loader/skeleton-loader';
import {
    getPatientClinicalDetails,
} from '@pages/patients/services/patients.service';
import {useQuery} from 'react-query';
import {GetPatientClinical, OneMinute} from '@constants/react-query-constants';
import {ClinicalDetails} from '@pages/patients/models/clinical-details';

export interface PatientClinicalProps {
    patientId: number;
}

const PatientClinical = ({patientId} : PatientClinicalProps) => {
    const { t } = useTranslation();

    const {isLoading, isError, data} = useQuery<ClinicalDetails, Error>([GetPatientClinical, patientId], () =>
            getPatientClinicalDetails(patientId),
        {
            staleTime: OneMinute
        }
    );

    if (isLoading || !data) {
        return <ThreeDots />;
    }
    if (isError) {
        return <div className={'p-4 text-danger'}>{t('patient.clinical.error')}</div>;
    }
    return (<>
            <Appointments clinical={data} />
            <RecentPatientCases clinical={data} />
        </>
    );
};

export default PatientClinical;
