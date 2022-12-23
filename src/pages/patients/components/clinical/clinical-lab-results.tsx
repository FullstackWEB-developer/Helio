import Table from '@components/table/table';
import {TableModel} from '@components/table/table.models';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import {useQuery} from 'react-query';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {useSelector} from 'react-redux';
import {selectPatient} from '@pages/patients/store/patients.selectors';
import {FiveMinute, GetLabResults} from '@constants/react-query-constants';
import {getPatientsLabResults} from '@pages/external-access/lab-results/services/lab-results.service';
import {RequestChannel} from '@shared/models/request.channel.enum';
import Spinner from '@components/spinner/Spinner';

const ClinicalLabResults = () => {
    const {t} = useTranslation();
    const patient: ExtendedPatient = useSelector(selectPatient);
    const {data: labResults, isFetching} = useQuery([GetLabResults, patient.patientId],
        () => getPatientsLabResults(patient.patientId, patient.departmentId ? patient.departmentId : patient.primaryDepartmentId, false, RequestChannel.Agent),
        {
            enabled: !!patient.patientId,
            cacheTime: FiveMinute,
            staleTime: Infinity
        });

    const tableModel: TableModel = {
        rows: labResults,
        pageable: true,
        showEmptyMessage: true,
        hasRowsBottomBorder: true,
        columns: [
            {
                title: 'patient.clinical.lab_results.description',
                widthClass: 'w-5/12',
                field: 'description',
                alignment: 'start',
                rowClassname: 'items-start h-full'
            }, {
                title: 'patient.clinical.lab_results.ordered_by',
                widthClass: 'w-3/12',
                field: 'providerName',
                alignment: 'start',
                rowClassname: 'items-start h-full'
            },
            {
                title: 'patient.clinical.lab_results.date',
                widthClass: 'w-2/12',
                field: 'labResultDate',
                alignment: 'start',
                render: (field) => <div className='body2 h-full flex items-center justify-start'>{dayjs(field).format('MMM DD, YYYY')}</div>
            }, {
                title: 'patient.clinical.lab_results.portal_status',
                widthClass: 'w-2/12',
                field: 'isPublishedToPortal',
                alignment: 'start',
                rowClassname: 'items-start h-full',
                render: (field) => <div className='body2'>{field ? t('patient.clinical.lab_results.published') : t('patient.clinical.lab_results.not_published')}</div>
            }
        ]
    }
    return <div className='pb-2 pt-8'>
        <div className='pb-5'>{t('patient.clinical.lab_results.title')}</div>
        <div>
        {
            isFetching ? <Spinner /> :
                <Table model={tableModel} />
        }
        </div>
    </div>
}

export default ClinicalLabResults;
