import {useState} from 'react';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import Spinner from '@components/spinner/Spinner';
import {GetSMSTemplates} from '@constants/react-query-constants';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {Trans, useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {useQuery} from 'react-query';
import SvgIcon, {Icon} from '@components/svg-icon';
import classNames from 'classnames';
import {useHistory} from 'react-router';
import {DefaultPagination, Paging} from '@shared/models';
import utils from '@shared/utils/utils';
import Pagination from '@components/pagination';
import {ConfigurationsPath, SMSTemplatesPath} from '@app/paths';
import {SMSTemplate} from '@pages/configurations/models/sms-templates';
import dayjs from 'dayjs';
import {SortDirection} from '@shared/models/sort-direction';
import Table from '@components/table/table';
import ToolTipIcon from '@components/tooltip-icon/tooltip-icon';
import {getSMSTemplates} from '@shared/services/notifications.service';
import {SMSDirection} from '@shared/models/sms-direction';


const SMSTemplates = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const pageSize = 8;
    const [paginationProperties, setPaginationProperties] = useState<Paging>({...DefaultPagination, pageSize});
    const [pagedResults, setPagedResults] = useState<SMSTemplate[]>([]);
    const {isFetching, data} = useQuery<SMSTemplate[]>(GetSMSTemplates, () => getSMSTemplates(), {
        onSuccess: (data) => paginateResults(data),
        onError: () => {
            setPagedResults([]);
            dispatch(addSnackbarMessage({
                message: 'configuration.sms_templates.error_fetching',
                type: SnackbarType.Error
            }))
        }
    });

    const paginateResults = (data: SMSTemplate[]) => {
        if (data && data.length > 1) {
            setPaginationProperties({
                pageSize: pageSize,
                page: 1,
                totalCount: data.length,
                totalPages: Math.ceil(data.length / pageSize),
            });
            setPagedResults(data.slice(0, pageSize));
        }
    }
    const sliceData = (): SMSTemplate[] => {
        if (data && data.length) {
            return data.slice(paginationProperties.pageSize * (paginationProperties.page - 1),
                paginationProperties.pageSize * paginationProperties.page);
        } else return [];
    }
    const handlePageChange = (p: Paging) => {
        setPaginationProperties(p);
        if (data && data.length) {
            setPagedResults(data.slice(p.pageSize * (p.page - 1),
                p.pageSize * p.page))
        }
    }
    const onSort = (sortField: string | undefined, sortDirection: SortDirection) => {
        if (sortField && data && data.length) {
            data.sort(utils.dynamicSort(sortField, sortDirection));
            setPagedResults(sliceData())
        }
    }
    const onEditIconClick = (id: string) => {
        history.push(`${ConfigurationsPath}/${SMSTemplatesPath}/${id}`);
    }
    const DisplayToolTip = (messages: string[]) => {
        return <ToolTipIcon
            icon={Icon.InfoOutline}
            iconFillClass='rgba-05-fill'
            placement='bottom'
            iconClassName='cursor-pointer icon ml-2'
        >
            <div className='flex flex-col p-6 w-80 normal-case'>
                {messages.map((message) => <div key={message} className='body2'>
                    <Trans i18nKey={message}>
                        <span className='subtitle2'></span>
                    </Trans>
                </div>)}
            </div>
        </ToolTipIcon>
    }
    const paginationDisplayConditions = paginationProperties.totalCount !== DefaultPagination.totalCount && data;
    let tableModel = {
        columns: [
            {
                title: 'configuration.sms_templates.grid_name',
                dataTestId: 'configuration.sms_templates.grid_name',
                field: 'name',
                isSortable: true,
                widthClass: 'w-4/12',
                disableNoneSort: false,
                onClick: (field: string | undefined, direction: SortDirection) => {
                    onSort(field, direction);
                },
                render: (value: string) => {
                    return (
                        <span>
                            {value}
                        </span>
                    );
                }
            },
            {
                dataTestId: 'configuration.sms_templates.grid_direction',
                title: <>{t('configuration.sms_templates.grid_direction')}
                    {DisplayToolTip(
                        ['configuration.sms_templates.tool_tip_grid_direction_two_way',
                            'configuration.sms_templates.tool_tip_grid_direction_one_way']
                    )}</>,
                field: 'direction',
                isSortable: true,
                widthClass: 'w-2/12',
                disableNoneSort: false,
                onClick: (field: string | undefined, direction: SortDirection) => {
                    onSort(field, direction);
                },
                render: (value: number) => {
                    return (
                        <span>
                            {SMSDirection[value]}
                        </span>
                    );
                }
            },
            {
                dataTestId: 'configuration.sms_templates.grid_modified_by',
                title: 'configuration.sms_templates.grid_modified_by',
                field: 'modifiedByName',
                isSortable: true,
                widthClass: 'w-3/12',
                disableNoneSort: false,
                onClick: (field: string | undefined, direction: SortDirection) => {
                    onSort(field, direction);
                },
                render: (value: string) => {
                    return (
                        <span>
                            {value}
                        </span>
                    );
                }
            },
            {
                dataTestId: 'configuration.sms_templates.grid_modified_on',
                title: 'configuration.sms_templates.grid_modified_on',
                field: 'modifiedOn',
                isSortable: true,
                widthClass: 'w-2/12',
                disableNoneSort: false,
                onClick: (field: string | undefined, direction: SortDirection) => {
                    onSort(field, direction);
                },
                render: (value: Date) => {
                    return (
                        <span>
                            {value && dayjs(value).year() !== 1901 ? dayjs.utc(value).local().format('MMM DD, YYYY') : ''}
                        </span>
                    );
                }
            },
            {
                dataTestId: 'id',
                title: '',
                field: 'id',
                isSortable: false,
                widthClass: 'w-1/12',
                disableNoneSort: false,
                onClick: (field: string | undefined, direction: SortDirection) => {
                    onSort(field, direction);
                },
                render: (value: string) => {
                    return (
                        <div>
                            <SvgIcon dataTestId={`edit-${value}`} type={Icon.Edit} fillClass={'rgba-038-fill'} onClick={() => onEditIconClick(value)} />
                        </div>
                    );
                }
            }
        ],
        rows: pagedResults,
        hasRowsBottomBorder: true,
        headerClassName: 'h-12',
        rowClass: 'h-20 items-center hover:bg-gray-100 cursor-pointer body2',
    };
    return (

        <div className='px-6 pt-7 flex flex-1 flex-col group overflow-y-auto'>
            <h6 className='pb-7'>{t('configuration.sms_templates.title')}</h6>
            <div className={classNames('body2 whitespace-pre-line', {'pb-14': !paginationDisplayConditions})} >{t('configuration.sms_templates.description')}</div>
            {
                paginationDisplayConditions && <div className='py-4 ml-auto'><Pagination value={paginationProperties} onChange={handlePageChange} /></div>
            }
            {isFetching ? <Spinner className='px-2' /> : <Table model={tableModel} />}
            {
                paginationDisplayConditions && <div className='py-4 ml-auto'><Pagination value={paginationProperties} onChange={handlePageChange} /></div>
            }
        </div>
    )
}

export default SMSTemplates;