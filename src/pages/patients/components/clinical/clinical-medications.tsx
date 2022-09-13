import Table from '@components/table/table';
import {TableModel} from '@components/table/table.models';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import {useQuery} from 'react-query';
import {QueryPatientMedication} from '@constants/react-query-constants';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {useSelector} from 'react-redux';
import {selectPatient} from '@pages/patients/store/patients.selectors';
import {getPatientMedications} from '@pages/external-access/request-refill/services/request-refill.service';
import Spinner from '@components/spinner/Spinner';

const ClinicalMedications = () => {
    const {t} = useTranslation();
    const patient: ExtendedPatient = useSelector(selectPatient);
    const {data: medications, isFetching} = useQuery([QueryPatientMedication, patient.patientId],
        () => getPatientMedications(patient.patientId), {
        enabled: !!patient.patientId
    });

    const tableModel: TableModel = {
        rows: medications,
        hasRowsBottomBorder: true,
        showEmptyMessage: true,
        title: {
            title: t('patient.clinical.medications.title')
        },
        columns: [
            {
                title: 'patient.clinical.medications.medication',
                widthClass: 'w-5/12',
                field: 'medicationName',
                rowClassname: 'mr-4',
            }, {
                title: 'patient.clinical.medications.ordered_by',
                widthClass: 'w-3/12',
                field: 'enteredBy',
                alignment: 'start',
                rowClassname: 'items-start h-full'
            },
            {
                title: 'patient.clinical.medications.prescribed',
                widthClass: 'w-3/12',
                field: 'prescribed',
                render: (field) => <div className='body2 h-full flex'>{!!field ? dayjs(field).format('MMM DD, YYYY') : t('common.not_available')}</div>
            }
        ]
    }
    return <div className='pt-9'>
        {
            isFetching ? <Spinner /> :
                <Table model={tableModel} />
        }
    </div>
}

export default ClinicalMedications;
