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
                widthClass:'w-5/12',
                field:'medicationName',
                rowClassname: 'mr-4',
            },{
                title:'patient.clinical.medications.ordered_by',
                widthClass:'w-3/12',
                field:'enteredBy',
                alignment:'start',
                rowClassname:'items-start h-full'
            },
            {
                title:'patient.clinical.medications.prescribed',
                widthClass:'w-3/12',
                field:'prescribed',
                render:(field) => <div className='body2 h-full flex'>{!!field ? dayjs(field).format('MMM DD, YYYY') : t('common.not_available')}</div>
            }
        ]
    }
    return <div className='pt-9'>
        <Table model={tableModel} />
    </div>
}

export default ClinicalMedications;
