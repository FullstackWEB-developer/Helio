import {ClinicalDetails} from '@pages/patients/models/clinical-details';
import Table from '@components/table/table';
import {TableModel} from '@components/table/table.models';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';

export interface ClinicalLabResults {
    clinical : ClinicalDetails;
}

const ClinicalLabResults = ({clinical} : ClinicalLabResults) => {
    const {t} = useTranslation();
    const tableModel: TableModel = {
        rows: clinical.labResults,
        title: {
            title:t('patient.clinical.lab_results.title')
        },
        showEmptyMessage:true,
        hasRowsBottomBorder:true,
        columns: [
             {
                title:'patient.clinical.lab_results.description',
                widthClass:'w-1/2',
                field:'description',
                 rowClassname:'items-start h-full'
            },
            {
                title:'patient.clinical.lab_results.date',
                widthClass:'w-1/2',
                field:'labResultDate',
                alignment:'center',
                render:(field) => <div className='body2 h-full flex items-center justify-center'>{dayjs(field).format('MMM DD, YYYY')}</div>
            }
        ]
    }
    return <div className='pt-8' >
        <Table model={tableModel} />
    </div>
}

export default ClinicalLabResults;
