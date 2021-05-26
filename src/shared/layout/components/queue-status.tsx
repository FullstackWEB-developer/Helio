import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getMetricOptions, getQueueStatus,} from '../../services/lookups.service';
import {selectMetricOptions} from '../../store/lookups/lookups.selectors';
import {QueueuMetric} from '../../models/queue-metric.model';
import Dropdown from '../../components/dropdown/dropdown';
import {DropdownModel} from '@components/dropdown/dropdown.models';
import {TableModel} from '@components/table/table.models';
import Table from '@components/table/table';
import {KeyValuePair} from 'src/shared/models/key-value-pair';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import {QueryQueueMetrics} from '@constants/react-query-constants';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {authenticationSelector} from "@shared/store/app-user/appuser.selectors";
import {selectLatestUsersStatusUpdateTime} from '@shared/layout/store/layout.selectors';
import {QueueStatusType} from "@shared/layout/enums/queue-status-type";

interface QueueStatusProps {
    queueType: QueueStatusType
}

const QueueStatus = ({queueType}: QueueStatusProps) => {
    const defaultDropdownKey = 5;
    const defaultDropdownValue = 'Agents with Contact';
    const dispatch = useDispatch();
    const {t: translate} = useTranslation();
    const metricOptions = useSelector(selectMetricOptions);
    const [activeMetric, setMetric] = useState<QueueuMetric[]>([]);
    const {username} = useSelector(authenticationSelector);
    const latestUserUpdateTime = useSelector(selectLatestUsersStatusUpdateTime);
    const [selectedOption, setSelectedOption] = useState<KeyValuePair | undefined>();

    const {isLoading, error, data: quickConnectExtensions, refetch} = useQuery<QueueuMetric[],
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
                setSelectedOption({
                    key: defaultDropdownKey.toString(),
                    value: defaultDropdownValue
                });
            }
            setMetric(metrics);
        }
    }, [dispatch, isLoading, queueType, quickConnectExtensions, selectedOption]);

    const selectOption = (key: string) => {
        if (quickConnectExtensions) {
            const metrics = quickConnectExtensions.filter(
                (m) => m.metricId.toString() === key
            );
            setMetric(metrics);
        }
        setSelectedOption(metricOptions.find(a => a.key === key));
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
            asSelect: true,
            defaultValue: selectedOption?.key,
            items: [],
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
        return ddModel;
    };

    const getTableModel = (): TableModel => {
        return {
            hasRowsBottomBorder: true,
            headerClassName: 'mb-2',
            isCompact: true,
            columns: [
                {
                    field: 'queueName',
                    widthClass: 'w-40',
                    title: 'statuses.queuestatus.queue',
                },
                {
                    field: 'voiceCount',
                    widthClass: 'w-24',
                    title: <SvgIcon type={Icon.Phone} fillClass='status-bar-inactive-item-icon'/>,
                    alignment: 'center',
                },
                {
                    field: 'chatCount',
                    widthClass: 'w-24',
                    title: <SvgIcon type={Icon.Chat} fillClass='status-bar-inactive-item-icon'/>,
                    alignment: 'center',
                },
            ],
            rows: activeMetric,
        };
    };

    if (error) {
        return <div>{translate('statuses.queuestatus.loading_error')}</div>;
    }
    if (isLoading) {
        return <ThreeDots className='w-48'/>;
    }

    return (
        <div className='flex-auto'>
            <Dropdown key={queueType} model={getDropDownOptions()}/>
            <div className='pt-10'>
                <Table model={getTableModel()}/>
            </div>
        </div>
    );
};

export default QueueStatus;
