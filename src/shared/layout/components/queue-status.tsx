import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMetricOptions } from '../../services/lookups.service';
import { selectMetricOptions } from '../../store/lookups/lookups.selectors';
import { QueueMetric } from '@shared/models';
import Dropdown from '../../components/dropdown/dropdown';
import { DropdownModel } from '@components/dropdown/dropdown.models';
import { TableModel } from '@components/table/table.models';
import Table from '@components/table/table';
import { KeyValuePair } from 'src/shared/models/key-value-pair';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { QueryQueueMetrics } from '@constants/react-query-constants';
import SvgIcon from '@components/svg-icon/svg-icon';
import { Icon } from '@components/svg-icon/icon';
import { userNameSelector } from "@shared/store/app-user/appuser.selectors";
import { selectLatestUsersStatusUpdateTime } from '@shared/layout/store/layout.selectors';
import { QueueStatusType } from "@shared/layout/enums/queue-status-type";
import Spinner from '@components/spinner/Spinner';
import { getQueueStatus } from '@pages/tickets/services/tickets.service';
import { customHooks } from '@shared/hooks';
import './queue-status.scss';

interface QueueStatusProps {
    queueType: QueueStatusType,
    queueTitle: string
}

const QueueStatus = ({ queueType, queueTitle }: QueueStatusProps) => {
    const defaultDropdownKey = 5;
    const defaultDropdownValue = 'Agents with Contact';
    const dispatch = useDispatch();
    const { t: translate } = useTranslation();
    const metricOptions = useSelector(selectMetricOptions);
    const [activeMetric, setMetric] = useState<QueueMetric[]>([]);
    const username = useSelector(userNameSelector);
    const latestUserUpdateTime = useSelector(selectLatestUsersStatusUpdateTime);
    const [selectedOption, setSelectedOption] = useState<KeyValuePair | undefined>();
    const [displayMetricDropdown, setDisplayMetricDropdown] = useState<boolean>(false);
    const metricDropdownRef = useRef<HTMLDivElement>(null);
    customHooks.useOutsideClick([metricDropdownRef], () => {
        setDisplayMetricDropdown(false);
    });


    const { isLoading, error, data: quickConnectExtensions, refetch } = useQuery<QueueMetric[],
        Error>([QueryQueueMetrics, queueType, username], () => queueType === QueueStatusType.AllQueues
            ? getQueueStatus()
            : getQueueStatus({
                agentUsername: username
            }), {
            staleTime: 0
        });

    useEffect(() => {
        refetch();
    }, [latestUserUpdateTime, refetch])

    useEffect(() => {
        dispatch(getMetricOptions());

        if (
            !isLoading &&
            quickConnectExtensions &&
            quickConnectExtensions.length > 0
        ) {
            const metrics = quickConnectExtensions?.filter(
                (m) => m.metricId === (selectedOption ? Number(selectedOption.key) : defaultDropdownKey)
            );
            if (!selectedOption) {
                setSelectedOption(metricOptions.find(a => Number(a.key) === defaultDropdownKey))
            }
            setMetric(metrics);
        } else if(!isLoading && (!quickConnectExtensions || quickConnectExtensions.length === 0)) {
            setSelectedOption(metricOptions.find(a => Number(a.key) === defaultDropdownKey));
        }
    }, [dispatch, isLoading, queueType, quickConnectExtensions, selectedOption, displayMetricDropdown, metricOptions]);

    const selectOption = (key: string) => {
        if (quickConnectExtensions) {
            const metrics = quickConnectExtensions.filter(
                (m) => m.metricId.toString() === key
            );
            setMetric(metrics);
        }
        setSelectedOption(metricOptions.find(a => a.key === key));
        setDisplayMetricDropdown(false);
    };

    const getDropDownOptions = (): DropdownModel => {
        let defaultMetricOption: KeyValuePair | undefined;
        if (metricOptions && metricOptions.length > 0) {
            defaultMetricOption = metricOptions.find(
                (m) => m.value === (selectedOption ? selectedOption.value : defaultDropdownValue)
            );
            if (!selectedOption) {
                setSelectedOption(defaultMetricOption);
            }
        }

        const ddModel: DropdownModel = {
            defaultValue: selectedOption?.key,
            items: [],
            itemsWrapperClass: 'h-72'
        };

        if (metricOptions && metricOptions.length > 0) {
            let dropDownOptions = metricOptions.filter(
                (item) => item.value !== selectedOption?.value
            );

            if (defaultMetricOption) {
                ddModel.items?.push({
                    label: defaultMetricOption.value,
                    value: defaultMetricOption.key,
                    isSelected: true,
                    onClick: selectOption,
                });
            }

            dropDownOptions.forEach((option) => {
                ddModel.items?.push({
                    label: option.value,
                    value: option.key,
                    onClick: selectOption,
                });
            });
        }
        ddModel.items = ddModel.items?.sort((a,b) => a.label.localeCompare(b.label));
        return ddModel;
    };

    const getTableModel = (): TableModel => {
        return {
            hasRowsBottomBorder: false,
            headerClassName: 'mb-2',
            size: 'compact',
            emptyMessage: 'statuses.queuestatus.no_agent_online',
            columns: [
                {
                    field: 'queueName',
                    widthClass: 'w-40',
                    title: 'statuses.queuestatus.queue',
                    rowClassname: 'body3-medium queue-status-table-item'
                },
                {
                    field: 'voiceCount',
                    widthClass: 'w-24',
                    title: <SvgIcon type={Icon.Phone} className='icon-small' fillClass='status-bar-inactive-item-icon' />,
                    alignment: 'center',
                    rowClassname: 'subtitle3'
                },
                {
                    field: 'chatCount',
                    widthClass: 'w-24',
                    title: <SvgIcon type={Icon.Chat} className='icon-small' fillClass='status-bar-inactive-item-icon' />,
                    alignment: 'center',
                    rowClassname: 'subtitle3'
                },
            ],
            rows: activeMetric,
        };
    };

    if (error) {
        return <div>{translate('statuses.queuestatus.loading_error')}</div>;
    }
    if (isLoading) {
        return <Spinner fullScreen />;
    }

    return (
        <div className='queue-status-div border-b overflow-y-hidden' id={queueTitle}>
            <div className='flex-auto h-full'>
                <div className='subtitle px-4 py-3 h-12 border-b flex items-center'>{queueTitle}</div>
                <div className='flex flex-col' ref={metricDropdownRef}>
                    <div
                        onClick={() => { setDisplayMetricDropdown(!displayMetricDropdown) }}
                        className='flex flex-row h-10 pl-4 py-2.5'>
                        <div className='body2' >
                            {selectedOption?.value}
                        </div>
                        <div className='ml-auto pr-3'>
                            <SvgIcon type={displayMetricDropdown ? Icon.ArrowUp : Icon.ArrowDown}
                                className='icon-medium'
                                fillClass={'rgba-color-062'} />
                        </div>
                    </div>

                    {displayMetricDropdown &&
                        <Dropdown key={queueType} model={getDropDownOptions()} />}
                </div>
                <div className='pb-10 flex flex-col h-4/5 overflow-y-auto'>
                    <Table model={getTableModel()} />
                </div>
            </div>
        </div>
    );
};

export default QueueStatus;
