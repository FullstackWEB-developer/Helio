import React from 'react';
import { getQuickConnects } from 'src/shared/services/lookups.service';
import List, { ListOption } from '@components/list/list';
import { useQuery } from 'react-query';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import { useTranslation } from 'react-i18next';
import { UserStatus } from 'src/shared/store/app-user/app-user.models';
import { QuickConnectExtension } from 'src/shared/models/quick-connect-extension';
import {QueryQuickConnects} from '@constants/react-query-constants';

const Extensions = () => {
  const { t: translate } = useTranslation();

  const { isLoading, error, data: quickConnectExtensions } = useQuery<
    QuickConnectExtension[],
    Error
  >(QueryQuickConnects, () => getQuickConnects());

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
    return <ThreeDots className='w-48'/>;
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='px-4 py-3 border-b flex items-center'>
          <h2 className='subtitle'>
            {translate('statuses.extensions.extensions_label')}
          </h2>
        </div>
        <div>
          <List options={getOptions()} isSearchable={true} />
        </div>
      </div>
    </>
  );
};

export default Extensions;
