import {useTranslation} from 'react-i18next';
import withErrorLogging from '@shared/HOC/with-error-logging';
import Table from '@components/table/table';
import {TableModel} from '@components/table/table.models';
import dayjs from 'dayjs';
import {useQuery} from 'react-query';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {useSelector} from 'react-redux';
import {selectPatient} from '@pages/patients/store/patients.selectors';
import {FiveMinute, GetPatientCases} from '@constants/react-query-constants';
import {getPatientCases} from '@pages/patients/services/patients.service';
import Spinner from '@components/spinner/Spinner';

const RecentPatientCases = () => {
    const {t} = useTranslation();
    const DeletedPatientCaseStatus = 'Deleted';
    const patient: ExtendedPatient = useSelector(selectPatient);

    const {data: cases, isFetching: fetchingPatientCases} = useQuery([GetPatientCases, patient.patientId],
        () => getPatientCases({patientId: patient.patientId, departmentId: patient.departmentId}),
        {
            enabled: !!patient.patientId,
            cacheTime: FiveMinute,
            staleTime: Infinity
        });

    const tableModel: TableModel = {
        rows: cases?.filter(a => a.status !== DeletedPatientCaseStatus) || [],
        title: {
            title: t('patient.clinical.recent_patient_cases')
        },
        showEmptyMessage: true,
        hasRowsBottomBorder: true,
        columns: [
            {
                title: 'patient.clinical.cases.date',
                widthClass: 'w-1/6',
                field: 'createdDate',
                alignment: 'start',
                render: (field) => <div className='body2 h-full flex items-center justify-start'>{dayjs(field).format('MMM DD, YYYY')}</div>
            },
            {
                title: 'patient.clinical.cases.description',
                widthClass: 'w-5/6',
                field: 'description',
                alignment: 'start',
                rowClassname: 'items-start h-full',
                render: (description) => <div>{description?.replace(/<[^>]*>?/gm, '')}</div>
            }
        ]
    }

    return <div className='pt-9' >
        {
            fetchingPatientCases ? <Spinner /> :
                <Table model={tableModel} />
        }
    </div>
};

export default withErrorLogging(RecentPatientCases);
