import {useTranslation} from 'react-i18next';
import withErrorLogging from '@shared/HOC/with-error-logging';
import {ClinicalDetails} from '@pages/patients/models/clinical-details';
import Table from '@components/table/table';
import {TableModel} from '@components/table/table.models';
import dayjs from 'dayjs';

export interface RecentPatientCasesProps {
    clinical : ClinicalDetails;
}

const RecentPatientCases = ({clinical}: RecentPatientCasesProps) => {
    const {t} = useTranslation();

    const tableModel: TableModel = {
        rows: clinical.patientCases,
        title: {
            title:t('patient.clinical.recent_patient_cases')
        },
        showEmptyMessage:true,
        hasRowsBottomBorder:true,
        columns: [
            {
                title:'patient.clinical.cases.date',
                widthClass:'w-1/6',
                field:'createdDate',
                alignment:'start',
                render:(field) => <div className='body2 h-full flex items-center justify-start'>{dayjs(field).format('MMM DD, YYYY')}</div>
            },
            {
                title:'patient.clinical.cases.description',
                widthClass:'w-5/6',
                field:'description',
                alignment:'start',
                rowClassname:'items-start h-full'
            }
        ]
    }

    return <div className='pt-9' >
        <Table model={tableModel} />
    </div>
};

export default withErrorLogging(RecentPatientCases);
