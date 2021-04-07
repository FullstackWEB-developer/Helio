import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownModel } from '@components/dropdown/dropdown.models';
import {
  getDepartments,
  getQuickConnects,
} from 'src/shared/services/lookups.service';
import List, { ListOption } from '@components/list/list';
import { useQuery } from 'react-query';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import { useTranslation } from 'react-i18next';
import { UserStatus } from 'src/shared/store/app-user/app-user.models';
import { selectDepartmentList } from 'src/shared/store/lookups/lookups.selectors';
import { QuickConnectExtension } from 'src/shared/models/quick-connect-extension';
import Dropdown from '../../components/dropdown/dropdown';
import RealTimeUserStatusUpdate from '../../websockets/real-time-user-status-update';
import {QueryQuickConnects} from '@constants/react-query-constants';

const Extensions = () => {
  const { t: translate } = useTranslation();
  const departments = useSelector(selectDepartmentList);
  const dispatch = useDispatch();

  const { isLoading, error, data: quickConnectExtensions } = useQuery<
    QuickConnectExtension[],
    Error
  >(QueryQuickConnects, () => getQuickConnects());

  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

  const getDropDownOptions = (): DropdownModel => {
    const ddModel: DropdownModel = {
      asSelect: true,
      defaultValue: 'all-departments',
      items: [
        {
          label: translate('statuses.extensions.all_departments'),
          value: 'all-departments',
        },
      ],
    };

    if (departments && departments.length > 0) {
      departments.forEach((option) => {
        ddModel.items?.push({
          label: option.name,
          value: option.id.toString(),
        });
      });
    }

    return ddModel;
  };

  const resolveUserStatus = (key: string): UserStatus | undefined => {
    return UserStatus[key as keyof typeof UserStatus];
  };

  const getOptions = (): ListOption[] => {
    const options: ListOption[] = [];
    if (quickConnectExtensions && quickConnectExtensions.length > 0) {
      quickConnectExtensions.forEach((e) => {
        options.push({
          label: `${e.firstName !== null ? e.firstName : ''} ${
            e.lastName !== null ? e.lastName : ''
          }`,
          value: e.id,
          status: resolveUserStatus(e.latestConnectStatus),
        });
      });
    }
    return options;
  };

  if (error) {
    return <div>{translate('statuses.extensions.loading_error')}</div>;
  }
  if (isLoading) {
    return <ThreeDots />;
  }

  return (
    <>
      <RealTimeUserStatusUpdate />
      <div className='flex flex-col'>
        <div className='px-4 py-3 border-b flex items-center'>
          <h2 className='subtitle'>
            {translate('statuses.extensions.extensions_label')}
          </h2>
        </div>
        <Dropdown model={getDropDownOptions()} />
        <div className='pt-10'>
          <List options={getOptions()} isSearchable={true} />
        </div>
      </div>
    </>
  );
};

export default Extensions;
