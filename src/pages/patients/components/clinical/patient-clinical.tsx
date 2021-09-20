import Appointments from './appointments';
import RecentPatientCases from './recent-patient-cases';
import { useTranslation } from 'react-i18next';
import {
    getPatientClinicalDetails,
} from '@pages/patients/services/patients.service';
import {useQuery} from 'react-query';
import {GetPatientClinical, OneMinute} from '@constants/react-query-constants';
import {ClinicalDetails} from '@pages/patients/models/clinical-details';
import Spinner from '@components/spinner/Spinner';
import ClinicalLabResults from '@pages/patients/components/clinical/clinical-lab-results';
import ClinicalMedications from '@pages/patients/components/clinical/clinical-medications';

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
        return <Spinner fullScreen/>;
    }
    if (isError) {
        return <div className={'p-4 text-danger'}>{t('patient.clinical.error')}</div>;
    }
    return (<>
            <Appointments clinical={data} />
            <RecentPatientCases clinical={data} />
            <div className='flex flex-col'>
                <div className='w-full'>
                    <ClinicalLabResults clinical={data} />
                </div>
                <div className='w-full'>
                    <ClinicalMedications clinical={data}/>
                </div>
            </div>
        </>
    );
};

export default PatientClinical;
