import SvgIcon, { Icon } from '@components/svg-icon';
import Collapsible from '@components/collapsible';
import { Controller, useForm } from 'react-hook-form';
import Radio from '@components/radio/radio';
import { Option } from '@components/option/option';
import ControlledSelect from '@components/controllers/controlled-select';
import { useEffect, useState } from 'react';
import { getUserList } from '@shared/services/lookups.service';
import { selectUserOptions } from '@shared/store/lookups/lookups.selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import ControlledDateInput from '@components/controllers/ControlledDateInput';
import { SmsFilterParamModel } from './sms-filter.model';
import classNames from 'classnames';
import { setIsSmsFiltered } from '@pages/sms/store/sms.slice';
import Button from '@components/button/button';
import { selectAppUserDetails } from '@shared/store/app-user/appuser.selectors';
import { BadgeNumber } from '@icons/BadgeNumber';
import { TicketListQueryType } from '@pages/tickets/models/ticket-list-type';
import { selectTicketQueryType } from '@pages/tickets/store/tickets.selectors';
import { selectUnreadSmsMessages, selectUnreadTeamSms } from '@pages/sms/store/sms.selectors';
const TIME_PERIOD_DATE_RANGE_OPTION = '3';

interface SmsFilterProps {
  className?: string;
  defaultValue?: SmsFilterParamModel;
  value?: SmsFilterParamModel;
  onCloseClick?: () => void;
  onFilterClick?: (param: SmsFilterParamModel) => void;
  isUserFilterEnabled?: boolean;
}
const SmsFilter = ({ className, isUserFilterEnabled, value, defaultValue, ...props }: SmsFilterProps) => {
  dayjs.extend(utc);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userList = useSelector(selectUserOptions);
  const appUser = useSelector(selectAppUserDetails);
  const ticketListQueryType = useSelector(selectTicketQueryType);
  const unreadSmsMessages = useSelector(selectUnreadSmsMessages);
  const unreadTeamSmsMessage = useSelector(selectUnreadTeamSms);
  const [displayFilters, setDisplayFilters] = useState<boolean>(true);
  const [fromDateField, setFromDateField] = useState<Date | undefined>(value?.fromDate ? dayjs(value.fromDate).utc().toDate() : undefined);
  const { control, handleSubmit, watch, setValue, reset } = useForm<SmsFilterParamModel>({
    defaultValues: defaultValue,
  });
  const watchTimePeriod = watch('timePeriod');

  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  useEffect(() => {
    if (value) {
      setValue('timePeriod', value.timePeriod);
      if (value.timePeriod === TIME_PERIOD_DATE_RANGE_OPTION) {
        if (value.fromDate) {
          setValue('fromDate', value.fromDate);
        }
        if (value.toDate) {
          setValue('toDate', value.toDate);
        }
      }
      setValue('assignedTo', value.assignedTo);
    }
  }, [setValue, value]);

  const getTimePeriodOptions = (): Option[] => [
    { value: '0', label: t('common.time_periods.today') },
    { value: '1', label: t('common.time_periods.last_7_days') },
    { value: '2', label: t('common.time_periods.last_30_days') },
    { value: '3', label: t('common.time_periods.date_range') },
  ];

  const getUserOptions = (): Option[] => {
    const cloned = [...userList];
    cloned.unshift({
      label: t('common.all'),
      value: 'all',
    });
    return cloned;
  };

  const getFormDate = (formData: any): { fromDate?: Date; toDate?: Date } => {
    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    if (formData.timePeriod) {
      if (formData.timePeriod === TIME_PERIOD_DATE_RANGE_OPTION) {
        if (formData.fromDate) {
          fromDate = formData.fromDate;
        }

        if (formData.toDate) {
          toDate = formData.toDate;
        }
      } else {
        let date = dayjs().utc();
        switch (formData.timePeriod) {
          case '0':
            date = date.startOf('day');
            break;
          case '1':
            date = date.subtract(7, 'day');
            break;
          case '2':
            date = date.subtract(30, 'day').startOf('day');
            break;
        }
        fromDate = date.toDate();
      }
    }
    return { fromDate: fromDate, toDate: toDate };
  };

  const onFilterClick = (formData: any) => {
    const filter: SmsFilterParamModel = {
      timePeriod: formData.timePeriod,
      unread: formData?.unread,
    };

    if (!!formData.assignedTo && formData.assignedTo !== 'all' && isUserFilterEnabled) {
      filter.assignedTo = formData.assignedTo;
    } else if (!isUserFilterEnabled) {
      filter.assignedTo = value?.assignedTo;
    }

    const formDate = getFormDate(formData);
    filter.fromDate = formDate.fromDate;
    filter.toDate = formDate.toDate;

    if (props.onFilterClick) {
      props.onFilterClick(filter);
    }

    if (filter.fromDate || filter.toDate) {
      dispatch(setIsSmsFiltered(true));
    } else if (filter.assignedTo !== appUser.id && filter.assignedTo && isUserFilterEnabled) {
      dispatch(setIsSmsFiltered(true));
    } else {
      dispatch(setIsSmsFiltered(false));
    }
  };

  const onClearFilter = () => {
    reset();
    setDisplayFilters(false);
    onFilterClick({});
    setTimeout(() => {
      setDisplayFilters(true);
    }, 0);
  };

  const onUnreadClick = () => {
    onFilterClick({ ...value, unread: true });
  };

  if (!displayFilters) {
    return null;
  }

  return (
    <div className={className}>
      <div className='flex-col py-4 pl-5 border-b'>
        <div className='flex justify-between'>
          <div className='subtitle'>{t('common.filters')}</div>
          <div className='flex flex-row items-center'>
            <div>
              <SvgIcon type={Icon.Close} onClick={props.onCloseClick} className='icon-small' wrapperClassName='pl-7 pr-4 cursor-pointer' />
            </div>
          </div>
        </div>
        <div className='flex flex-row pt-4'>
          <Button
            data-test-id='apply-button'
            className='mr-4 cursor-pointer'
            label='common.apply'
            buttonType='small'
            onClick={() => handleSubmit(onFilterClick)()}
          ></Button>
          <Button data-test-id='reset-all-button' className='cursor-pointer' label='common.reset_all' buttonType='secondary' onClick={onClearFilter}></Button>
        </div>
      </div>
      <div className='flex flex-col pt-4 pl-5 pr-4'>
        <div role='button' className='flex flex-row items-center h-10 mb-4 cursor-pointer pr-14' onClick={onUnreadClick}>
          <div className='pr-3 cursor-pointer subtitle'>{t('tickets.filter.unread_sms')}</div>
          <div>
            <BadgeNumber type='red' number={isUserFilterEnabled ? unreadTeamSmsMessage : unreadSmsMessages} />
          </div>
        </div>
        <Collapsible title={t('sms.filter.time_section')} isOpen headerClassName='h-10 mb-1.5'>
          <Controller
            control={control}
            name='timePeriod'
            defaultValue=''
            render={radioProps => {
              return (
                <Radio
                  name='timePeriod'
                  truncate={true}
                  ref={radioProps.ref}
                  data-test-id='timePeriod-radio'
                  value={radioProps.value}
                  items={getTimePeriodOptions()}
                  onChange={radioProps.onChange}
                />
              );
            }}
          />
          <div
            className={classNames({
              hidden: watchTimePeriod !== TIME_PERIOD_DATE_RANGE_OPTION,
            })}
          >
            <ControlledDateInput
              control={control}
              type='date'
              label='tickets.filter.from_date'
              name='fromDate'
              defaultValue={null}
              max={new Date(new Date().toDateString())}
              min={dayjs().subtract(6, 'month').toDate()}
              dataTestId='ticket-filter-from-date'
              isCalendarPositionComputed
              isSmallSize={true}
              onChange={setFromDateField}
            />
            <ControlledDateInput
              control={control}
              type='date'
              isCalendarPositionComputed
              defaultValue={null}
              min={fromDateField}
              max={new Date(new Date().toDateString())}
              disabled={!fromDateField}
              label='tickets.filter.to_date'
              name='toDate'
              dataTestId='ticket-filter-to-date'
              isSmallSize={true}
            />
          </div>
        </Collapsible>
        {isUserFilterEnabled && (
          <Collapsible title={t('sms.filter.team_section')} isOpen className='pt-4' headerClassName='h-10 mb-1.5'>
            <ControlledSelect 
                control={control} 
                name='assignedTo' 
                defaultValue='all' 
                options={getUserOptions()} 
                onTextChange={(e) => { if(e === '') setValue('assignedTo','');}}
            />
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export default SmsFilter;
