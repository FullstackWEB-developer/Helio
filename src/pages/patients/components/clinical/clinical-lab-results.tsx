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
        pageable: true,
        title: {
            title:t('patient.clinical.lab_results.title')
        },
        showEmptyMessage:true,
        hasRowsBottomBorder:true,
        columns: [
            {
                title:'patient.clinical.lab_results.description',
                widthClass:'w-5/12',
                field:'description',
                alignment:'start',
                rowClassname:'items-start h-full'
            },{
                title:'patient.clinical.lab_results.ordered_by',
                widthClass:'w-3/12',
                field:'providerName',
                alignment:'start',
                rowClassname:'items-start h-full'
            },
            {
                title:'patient.clinical.lab_results.date',
                widthClass:'w-2/12',
                field:'labResultDate',
                alignment:'start',
                render:(field) => <div className='body2 h-full flex items-center justify-start'>{dayjs(field).format('MMM DD, YYYY')}</div>
            },{
                title:'patient.clinical.lab_results.portal_status',
                widthClass:'w-2/12',
                field:'isPublishedToPortal',
                alignment:'start',
                rowClassname:'items-start h-full',
                render:(field) => <div className='body2'>{field ? t('patient.clinical.lab_results.published'): t('patient.clinical.lab_results.not_published')}</div>
            }
        ]
    }
    return <div className='pt-9' >
        <Table model={tableModel} />
    </div>
}

export default ClinicalLabResults;
