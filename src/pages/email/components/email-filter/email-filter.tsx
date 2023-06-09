import SvgIcon, { Icon } from "@components/svg-icon";
import Collapsible from "@components/collapsible";
import { Controller, useForm } from "react-hook-form";
import Radio from "@components/radio/radio";
import { Option } from "@components/option/option";
import ControlledSelect from "@components/controllers/controlled-select";
import { useContext, useEffect, useState } from 'react';
import { getUserList } from "@shared/services/lookups.service";
import { selectUserOptions } from "@shared/store/lookups/lookups.selectors";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import ControlledDateInput from "@components/controllers/ControlledDateInput";
import classNames from "classnames";
import { EmailFilterModel } from "@pages/email/components/email-filter/email-filter.model";
import {
  TimePeriodDateRange,
  TimePeriodLast30Days,
  TimePeriodLast7Days,
  TimePeriodOptions,
  TimePeriodToday,
} from "@shared/models/email-sms-time-period-options";
import useCheckPermission from "@shared/hooks/useCheckPermission";
import { selectAppUserDetails } from "@shared/store/app-user/appuser.selectors";
import { setEmailHasFilter } from "@pages/email/store/email-slice";
import { DEFAULT_FILTER_VALUE } from "@pages/email/constants";
import Button from "@components/button/button";
import { BadgeNumber } from "@icons/BadgeNumber";
import { selectTicketQueryType } from "@pages/tickets/store/tickets.selectors";
import { TicketListQueryType } from "@pages/tickets/models/ticket-list-type";
import {
  selectUnreadEmails,
  selectUnreadTeamEmails,
} from "@pages/email/store/email.selectors";
import { EmailContext } from '@pages/email/context/email-context';
import { EmailQueryType } from '@pages/email/models/email-query-type';

interface EmailFilterProps {
  className?: string;
  value?: EmailFilterModel;
  onCloseClick?: () => void;
  onFilterClick?: (param: EmailFilterModel) => void;
  isUserFilterEnabled?: boolean;
}
const EmailFilter = ({
  className,
  isUserFilterEnabled,
  value,
  ...props
}: EmailFilterProps) => {
  dayjs.extend(utc);
  const dispatch = useDispatch();
  const [displayFilters, setDisplayFilters] = useState<boolean>(true);
  const appUser = useSelector(selectAppUserDetails);
  const { id } = useSelector(selectAppUserDetails);
  const unreadEmails = useSelector(selectUnreadEmails);
  const unreadTeamEmails = useSelector(selectUnreadTeamEmails);
  const { t } = useTranslation();
  const userList = useSelector(selectUserOptions);
  const [fromDateField, setFromDateField] = useState<Date | undefined>(
    value?.fromDate ? dayjs(value.fromDate).utc().toDate() : undefined,
  );
  
  const {
    emailQueryType,
    isDefaultTeamView
  } = useContext(EmailContext)!;

  const { control, handleSubmit, watch, setValue, reset } =
    useForm<EmailFilterModel>();
  const watchTimePeriod = watch("timePeriod");

  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  useEffect(() => {
    if (value) {
      setValue("timePeriod", value.timePeriod);
      if (value.timePeriod === TimePeriodDateRange) {
        if (value.fromDate) {
          setValue("fromDate", value.fromDate);
        }
        if (value.toDate) {
          setValue("toDate", value.toDate);
        }
      }
      setValue("assignedTo", value.assignedTo);
    }
  }, [setValue, value]);

  const getUserOptions = (): Option[] => {
    const cloned = [...userList];
    cloned.unshift({
      label: t("common.all"),
      value: "all",
    });
    return cloned;
  };

  const getFormDate = (formData: any): { fromDate?: Date; toDate?: Date } => {
    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    if (formData.timePeriod) {
      if (formData.timePeriod === TimePeriodDateRange) {
        if (formData.fromDate) {
          fromDate = formData.fromDate;
        }

        if (formData.toDate) {
          toDate = formData.toDate;
        }
      } else {
        let date = dayjs().utc();
        switch (formData.timePeriod) {
          case TimePeriodToday:
            date = date.startOf("day");
            break;
          case TimePeriodLast7Days:
            date = date.subtract(7, "day");
            break;
          case TimePeriodLast30Days:
            date = date.subtract(30, "day").startOf("day");
            break;
        }
        fromDate = date.toDate();
      }

      dispatch(setEmailHasFilter(true));
    }
    return { fromDate: fromDate, toDate: toDate };
  };

  const onFilterClick = (formData: any) => {
    const filter: EmailFilterModel = {
      timePeriod: formData.timePeriod,
      unread: formData?.unread,
    };

    if (!!formData.assignedTo && formData.assignedTo !== 'all' && isUserFilterEnabled) {
      if (formData.assignedTo !== appUser.id) {
        dispatch(setEmailHasFilter(true));
      }
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
  };

  const onClearFilter = () => {
    const defaults = {
      timePeriod: DEFAULT_FILTER_VALUE.timePeriod,
      assignedTo: isDefaultTeamView ? "" : id,
    };
    reset(defaults);
    dispatch(setEmailHasFilter(false));
    setDisplayFilters(false);
    setTimeout(() => {
      setDisplayFilters(true);
    }, 0);
    onFilterClick(defaults);
  };

  const onUnreadClick = () => {
    onFilterClick({ ...value, unread: true });
  };

  if (!displayFilters) {
    return null;
  }

  return (
    <div className={className}>
      <div className='flex flex-col py-4 pl-5 border-b'>
        <div className='flex justify-between'>
          <div className='subtitle'>{t("common.filters")}</div>
          <div className='flex flex-row items-center'>
            <div>
              <SvgIcon
                type={Icon.Close}
                onClick={props.onCloseClick}
                className='icon-small'
                wrapperClassName='pl-7 pr-4 cursor-pointer'
              />
            </div>
          </div>
        </div>
        <div className='flex flex-row pt-4'>
          <Button
            data-testid='apply-button'
            data-test-id='apply-button'
            className='mr-4 cursor-pointer'
            label='common.apply'
            buttonType='small'
            onClick={() => handleSubmit(onFilterClick)()}
          ></Button>
          <Button
            data-testid='reset-all-button'
            data-test-id='reset-all-button'
            className='cursor-pointer'
            label='common.reset_all'
            buttonType='secondary'
            onClick={onClearFilter}
          ></Button>
        </div>
      </div>
      <div className='flex flex-col pt-4 pl-5 pr-4'>
        <div
          role='button'
          className='flex flex-row items-center h-10 mb-4 cursor-pointer pr-14'
          onClick={onUnreadClick}
        >
          <div className='pr-3 cursor-pointer subtitle'>
            {t("tickets.filter.unread_email")}
          </div>
          <div>
            <BadgeNumber
              type='red'
              number={
                emailQueryType === EmailQueryType.TeamEmail
                  ? unreadTeamEmails
                  : unreadEmails
              }
            />
          </div>
        </div>

        <Collapsible
          title={t("email.filter.time_section")}
          isOpen
          headerClassName='h-10 mb-1.5'
        >
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
                  data-testid='timePeriod-radio'
                  value={radioProps.value}
                  items={TimePeriodOptions}
                  onChange={radioProps.onChange}
                />
              );
            }}
          />
          <div
            className={classNames({
              hidden: watchTimePeriod !== TimePeriodDateRange,
            })}
          >
            <ControlledDateInput
              control={control}
              type='date'
              label='tickets.filter.from_date'
              name='fromDate'
              defaultValue={null}
              max={new Date(new Date().toDateString())}
              min={dayjs().subtract(6, "month").toDate()}
              dataTestId='ticket-filter-from-date'
              isCalendarPositionComputed
              onChange={setFromDateField}
              isSmallSize={true}
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
          <Collapsible
            title={t("email.filter.team_section")}
            isOpen
            className='pt-4'
            headerClassName='h-10 mb-1.5'
          >
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

export default EmailFilter;
