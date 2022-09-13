import {useQuery} from 'react-query';
import {LabResult} from '@pages/external-access/lab-results/models/lab-result.model';
import {GetLabResults} from '@constants/react-query-constants';
import {getPatientsLabResults} from '@pages/external-access/lab-results/services/lab-results.service';
import Spinner from '@components/spinner/Spinner';
import {useTranslation} from 'react-i18next';
import Table from '@components/table/table';
import {TableModel} from '@components/table/table.models';
import dayjs from 'dayjs';
import {
    NotificationTemplateContainerType
} from '@components/notification-template-select/components/parent-extra-template';
import {RequestChannel} from '@shared/models/request.channel.enum';

export interface NotificationLabResultProps {
    patientId: number;
    departmentId: number;
    parentType? : NotificationTemplateContainerType
}

const NotificationLabResult = ({patientId, departmentId, parentType} : NotificationLabResultProps) => {
    const {t} = useTranslation();
    const {isLoading, data, isError} = useQuery<LabResult[]>([GetLabResults, patientId], () => {
        return getPatientsLabResults(patientId, departmentId, true, RequestChannel.Agent);
    });

    if (isLoading) {
        return <Spinner fullScreen/>
    }

    if (isError) {
        return <div>{t('tickets.notifications.lab_results.error')}</div>
    }


    let tableModel : TableModel = {
        columns: [
            {
                title: 'tickets.notifications.lab_results.collect_date',
                field:'labResultDate',
                widthClass: `flex-0 ${parentType === 'ccp' ? 'w-24' : 'w-48'}`,
                render:(field) => <div className='body2 h-full flex items-center'>{dayjs(field).format('MMM, d YYYY')}</div>
            },{
                title: 'tickets.notifications.lab_results.test',
                field:'description',
                widthClass:'flex-1',
                rowClassname: 'subtitle2'
            },
            {
                title: 'tickets.notifications.lab_results.published',
                field:'resultStatus',
                widthClass:'w-24 flex-0',
                render:(field) => <div className='body2 h-full flex items-center'>{field === 'final' ? t('common.yes') : t('common.no')}</div>
            },
        ],
        rowClass: `bg-white ${parentType === 'ccp' ? '' : 'pr-16'}`,
        headerClassName: parentType === 'ccp' ? '' : 'pr-16',
        rows: data!,
        hasRowsBottomBorder: true
    };
    return <Table model={tableModel}/>;
}
export default NotificationLabResult;
