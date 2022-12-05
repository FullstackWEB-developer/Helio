import React, { useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_FILTER_VALUE } from '../constants';
import { DropdownItemModel } from '@components/dropdown';
import { EmailQueryType } from '@pages/email/models/email-query-type';
import DropdownLabel from '@components/dropdown-label';
import { EmailFilterModel } from '@pages/email/components/email-filter/email-filter.model';
import EmailFilterBar from '@pages/email/components/email-filter/email-filter-bar';
import EmailSummaryList from '@pages/email/components/email-summary-list/email-summary-list';
import Spinner from '@components/spinner/Spinner';
import useDebounce from '../../../shared/hooks/useDebounce';
import { DEBOUNCE_SEARCH_DELAY_MS } from '@constants/form-constants';
import { EmailContext } from '../context/email-context';
import { useSelector } from 'react-redux';
import { selectAppUserDetails } from '@shared/store/app-user/appuser.selectors';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import utils from '@shared/utils/utils';

const EmailLeftMenu = () => {
  dayjs.extend(utc);
  const [searchTerm, setSearchTerm] = useState<string>();
  const [isFilterVisible, setFilterVisible] = useState<boolean>(false);
  const { id } = useSelector(selectAppUserDetails);
  const [debounceSearchTerm] = useDebounce(
    searchTerm,
    DEBOUNCE_SEARCH_DELAY_MS,
  );
  const {
    setEmailQueryType,
    emailQueryType,
    queryParams,
    setQueryParams,
    getEmailsQuery,
    isDefaultTeamView,
    isFetchingContactNames,
    isLoadingContactNames,
  } = useContext(EmailContext)!;

  const [filterParams, setFilterParams] = useState<EmailFilterModel>({
    ...DEFAULT_FILTER_VALUE,
    assignedTo: isDefaultTeamView ? '' : id,
  });

  useEffect(() => {
    setQueryParams({
      ...queryParams,
      searchTerm: debounceSearchTerm?.trim(),
      page: 1,
    });
  }, [debounceSearchTerm]);

  useEffect(() => {
    setEmailQueryType(
      isDefaultTeamView ? EmailQueryType.TeamEmail : EmailQueryType.MyEmail,
    );
  }, [isDefaultTeamView]);

  useEffect(() => {
    if (!filterParams) {
      return;
    }
    if (filterParams.assignedTo === id) {
      setEmailQueryType(EmailQueryType.MyEmail);
    } else if (filterParams.assignedTo === '') {
      setEmailQueryType(EmailQueryType.TeamEmail);
    }
  }, [filterParams, id]);

  const onDropdownClick = (item: DropdownItemModel) => {
    const context = item.value as EmailQueryType;
    changeQueryType(context);
  };

  const changeQueryType = (context: EmailQueryType) => {
    if (emailQueryType === context) {
      return;
    }

    if (context === EmailQueryType.TeamEmail) {
      setQueryParams({ ...queryParams, assignedTo: undefined });
      setFilterParams({ ...filterParams, assignedTo: undefined });
    } else {
      setQueryParams({ ...queryParams, assignedTo: id });
      setFilterParams({ ...filterParams, assignedTo: id });
    }
    setEmailQueryType(context);
  };
  const handleScroll = (event: any) => {
    const target = event.target;
    if (
      target.scrollHeight <= target.scrollTop + target.clientHeight &&
      !getEmailsQuery.isFetchingNextPage
    ) {
      getEmailsQuery.fetchNextPage().then();
    }
  };

  const loading = useMemo(() => {
    return (
      getEmailsQuery.isLoading &&
      !getEmailsQuery.isFetchingNextPage &&
      isLoadingContactNames &&
      isFetchingContactNames
    );
  }, [
    getEmailsQuery.isFetchingNextPage,
    getEmailsQuery.isLoading,
    isLoadingContactNames,
    isFetchingContactNames,
  ]);

  const onFilterClick = (value: EmailFilterModel) => {
    let params = {
      ...queryParams,
      assignedTo: value.assignedTo,
      fromDate: '',
      toDate: '',
      unread: value.unread,
    };
    if (value.fromDate) {
      params = {
        ...params,
        fromDate: utils.toShortISOLocalString(value.fromDate),
      };
    }
    if (value.toDate) {
      params = {
        ...params,
        toDate: utils.toShortISOLocalString(value.toDate),
      };
    }

    setQueryParams(params);
    setFilterVisible(false);
    setFilterParams(value);
  };

  return (
    <div className='flex flex-row email'>
      <div className='flex flex-col pt-6 border-r email-sidebar'>
        <div className='pb-2 pl-5 border-b'>
          <DropdownLabel
            dataTestId='email-query-type-changer'
            items={[
              {
                label: 'email.query_type.my_email',
                value: EmailQueryType.MyEmail,
              },
              {
                label: 'email.query_type.team_email',
                value: EmailQueryType.TeamEmail,
              },
            ]}
            value={emailQueryType}
            onClick={item => onDropdownClick(item)}
          />
        </div>
        <EmailFilterBar
          isFilterVisible={isFilterVisible}
          setFilterVisible={setFilterVisible}
          emailQueryType={emailQueryType}
          filter={filterParams}
          onSearchTermChanged={setSearchTerm}
          onFilterClick={onFilterClick}
        />
        {loading && (
          <div className='h-full'>
            <Spinner fullScreen={true} />
          </div>
        )}
        {!loading && !isFilterVisible && (
          <EmailSummaryList
            searchTerm={searchTerm}
            onScroll={handleScroll}
            isFetchingNextPage={getEmailsQuery.isFetchingNextPage}
          />
        )}
      </div>
    </div>
  );
};

export default EmailLeftMenu;
