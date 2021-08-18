import {ClinicalDetails} from '@pages/patients/models/clinical-details';
import Table from '@components/table/table';
import {TableModel} from '@components/table/table.models';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';

export interface ClinicalLabResults {
    clinical : ClinicalDetails;
}

const ClinicalMedications = ({clinical} : ClinicalLabResults) => {
    const {t} = useTranslation();
    const tableModel: TableModel = {
        rows: clinical.medications,
        hasRowsBottomBorder:true,
        showEmptyMessage:true,
        title: {
            title:t('patient.clinical.medications.title')
        },
        columns: [
             {
                title:'patient.clinical.medications.medication',
                widthClass:'w-2/3',
                field:'medicationName'
            },
            {
                title:'patient.clinical.medications.prescribed',
                widthClass:'w-1/3',
                field:'prescribed',
                render:(field) => <div className='body2 h-full flex'>{dayjs(field).format('MMM DD, YYYY')}</div>
            }
        ]
    }
    return <div className='pt-8'>
        <Table model={tableModel} />
    </div>
}

export default ClinicalMedications;
