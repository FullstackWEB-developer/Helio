import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMetricOptions,
  getQueueStatus,
} from '../../services/lookups.service';
import { selectMetricOptions } from '../../store/lookups/lookups.selectors';
import { QueueuMetric } from '../../models/queue-metric.model';
import Dropdown from '../../components/dropdown/dropdown';
import { DropdownModel } from '@components/dropdown/dropdown.models';
import { TableModel } from '@components/table/table.models';
import Table from '@components/table/table';
import { ReactComponent as PhoneIcon } from '../../../shared/icons/Icon-Phone-24px.svg';
import { ReactComponent as ChatIcon } from '../../../shared/icons/Icon-Chat-24px.svg';
import { KeyValuePair } from 'src/shared/models/key-value-pair';
import { useTranslation } from 'react-i18next';
import QueueStatusTabs from './queue-status-tabs';
import { useQuery } from 'react-query';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import {QueryQueueMetrics} from '@constants/react-query-constants';

const QueueStatus = () => {
  const { t: translate } = useTranslation();
  const metricOptions = useSelector(selectMetricOptions);
  const [isDefaultSet, setDefault] = useState(false);
  const [activeMetric, setMetric] = useState<QueueuMetric[]>([]);

  const dispatch = useDispatch();

  const { isLoading, error, data: quickConnectExtensions } = useQuery<
    QueueuMetric[],
    Error
  >(QueryQueueMetrics, () => getQueueStatus());

  useEffect(() => {
    dispatch(getMetricOptions());

    if (
      !isLoading &&
      quickConnectExtensions &&
      quickConnectExtensions.length > 0 &&
      !isDefaultSet
    ) {
      const metrics = quickConnectExtensions?.filter(
        (m) => m.metric === 'AGENTS_ON_CONTACT'
      );
      setMetric(metrics);
      setDefault(true);
    }
  }, [dispatch, isDefaultSet, isLoading, quickConnectExtensions]);

  const selectedOption = (key: string) => {
    if (quickConnectExtensions) {
      const metrics = quickConnectExtensions.filter(
        (m) => m.metricId.toString() === key.toString()
      );
      setMetric(metrics);
    }
  };

  const getDropDownOptions = (): DropdownModel => {
    let defaultMetricOption: KeyValuePair | undefined;
    if (metricOptions && metricOptions.length > 0) {
      defaultMetricOption = metricOptions.find(
        (m) => m.value === 'Agents with Contact'
      );
    }

    const ddModel: DropdownModel = {
      asSelect: true,
      defaultValue: defaultMetricOption?.key,
      items: [],
    };

    if (metricOptions && metricOptions.length > 0) {
      let dropDownOptions = metricOptions.filter(
        (item) => item.value !== defaultMetricOption?.value
      );
      
      if (defaultMetricOption) {
        ddModel.items?.push({
          label: defaultMetricOption.value,
          value: defaultMetricOption.key,
          isSelected: true,
          onClick: selectedOption,
        });
      }

      dropDownOptions.forEach((option) => {
        ddModel.items?.push({
          label: option.value,
          value: option.key,          
          onClick: selectedOption,
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
          title: <PhoneIcon />,
          alignment: 'center',
        },
        {
          field: 'chatCount',
          widthClass: 'w-24',
          title: <ChatIcon />,
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
    return <ThreeDots />;
  }

  return (
    <div className='flex-auto'>
      <div className='px-4 py-3 '>
        <h2 className='subtitle'>
          {translate('statuses.queuestatus.queueus_status')}
        </h2>
      </div>
      <QueueStatusTabs />
      <Dropdown model={getDropDownOptions()} />
      <div className='pt-10'>
        <Table model={getTableModel()} />
      </div>
    </div>
  );
};

export default QueueStatus;
