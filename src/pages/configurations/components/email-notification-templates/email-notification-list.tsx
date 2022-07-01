import { ConfigurationsPath } from '@app/paths';
import SvgIcon, { Icon } from '@components/svg-icon';
import Table from '@components/table/table';
import { TableModel } from '@components/table/table.models';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GetEmailNotificationTemplates } from '@constants/react-query-constants';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import Spinner from '@components/spinner/Spinner';
import { EmailTemplate } from '@pages/configurations/models/email-template';
import { getEmailNotificationList } from '@shared/services/notifications.service';
import { SortDirection } from '@shared/models/sort-direction';
import dayjs from 'dayjs';
import utils from '@shared/utils/utils';

const EmailNotificationList = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [pagedResults, setPagedResults] = useState<EmailTemplate[]>([]);

    const { data, isFetching, isLoading } = useQuery<EmailTemplate[]>(GetEmailNotificationTemplates, () => getEmailNotificationList(), {
        onSuccess: (data) => setPagedResults(data),
        onError: () => {
            setPagedResults([]);
            dispatch(addSnackbarMessage({
                message: 'configuration.email_template_list.error_fetching',
                type: SnackbarType.Error
            }))
        }
    });

    const onSort = (sortField: string | undefined, sortDirection: SortDirection) => {
        if (sortField && data && data.length) {
            var sortedData = data.slice(0).sort(utils.dynamicSort(sortField, sortDirection));
            setPagedResults(sortedData);
        }
    }

    const tableModel: TableModel = {
        hasRowsBottomBorder: true,
        rows: pagedResults,
        headerClassName: 'h-12',
        rowClass: 'h-14 items-center body2',
        pageable: true,
        paginationPosition: 'both',
        columns: [{
            title: 'configuration.email_template_list.email_template_name',
            field: 'name',
            widthClass: 'w-2/5',
            isSortable: true,
            onClick: (field: string | undefined, direction: SortDirection) => {
                onSort(field, direction);
            }
        },
        {
            title: 'configuration.email_template_list.email_subject',
            field: 'subject',
            widthClass: 'w-2/5',
            isSortable: true,
            onClick: (field: string | undefined, direction: SortDirection) => {
                onSort(field, direction);
            }
        },
        {
            title: 'configuration.email_template_list.email_template_modified_on',
            field: 'modifiedOn',
            widthClass: 'w-1/6',
            isSortable: true,
            onClick: (field: string | undefined, direction: SortDirection) => {
                onSort(field, direction);
            },
            render: (value: Date) => {
                return (
                    <span>
                        {value ? dayjs.utc(value).local().format('MMM DD, YYYY') : ''}
                    </span>
                );
            }
        },
        {
            title: '',
            field: 'id',
            widthClass: 'w-1/12',
            render: (id: string) => {
                return (
                    <div>
                        <SvgIcon type={Icon.Edit} className={'cursor-pointer'} fillClass={'rgba-038-fill'} onClick={() => { history.push(`${ConfigurationsPath}/email-templates/${id}`) }} />
                    </div>
                );
            }
        }
        ]
    };

    return (
        <div className='flex flex-col flex-1 overflow-auto h-full p-6 pr-4'>
            <h6 className='pb-7'>{t('configuration.email_template_list.title')}</h6>
            <div className='body2'>{t('configuration.email_template_list.description')}</div>
            {isFetching || isLoading ? (
                <Spinner className='pt-2 px-2' />
            ) : (
                <div>
                    <Table model={tableModel} />
                </div>
            )}
        </div>

    );
}

export default EmailNotificationList;