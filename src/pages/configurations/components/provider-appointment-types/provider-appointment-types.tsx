import { useEffect, useMemo, useState } from 'react';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import Spinner from '@components/spinner/Spinner';
import { GetAppointmentTypesForProvider } from '@constants/react-query-constants';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from 'react-query';
import SvgIcon, { Icon } from '@components/svg-icon';
import { DefaultPagination, Paging } from '@shared/models';
import utils from '@shared/utils/utils';
import Pagination from '@components/pagination';
import ToolTipIcon from '@components/tooltip-icon/tooltip-icon';
import { AppointmentTypeForProvider } from '@shared/models/appointment-type-for-provider';
import { getAppointmentTypesForProvider, saveAppointmentTypesForProvider } from '@shared/services/notifications.service';
import { selectProviderList } from '@shared/store/lookups/lookups.selectors';
import { Option } from '@components/option/option';
import { ControlledSelect } from '@components/controllers';
import { useForm } from 'react-hook-form';
import { AppointmentTypesForProviderUpdateRequest } from '@shared/models/appointment-type-for-provider-update-request';
import Button from '@components/button/button';
import ToggleSwitch from '@components/toggle-switch/toggle-switch';
import { getProviders } from '@shared/services/lookups.service';
import './provider-appointment-types.scss';
import classnames from 'classnames';
import ElipsisTooltipTextbox from '@components/elipsis-tooltip-textbox/elipsis-tooltip-textbox';
import RouteLeavingGuard from '@components/route-leaving-guard/route-leaving-guard';
import { useHistory } from 'react-router-dom';

interface AppointmentTypesForProviderForm {
  providerId: number;
}
const ProviderAppointmentType = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [initialData, setInitialData] = useState<string>('');
  const pageSize = 8;
  const history = useHistory();
  const [paginationProperties, setPaginationProperties] = useState<Paging>({ ...DefaultPagination, pageSize });
  const providers = useSelector(selectProviderList);
  const providerOptions = useMemo(
    () =>
      utils.parseOptions(
        providers,
        item => utils.stringJoin(' ', item.firstName, item.lastName),
        item => item.id.toString(),
      ),
    [providers],
  );

  useEffect(() => {
    dispatch(getProviders());
  }, []);
  const [selectedProvider, setSelectedProvider] = useState<number>();
  const [pagedResults, setPagedResults] = useState<AppointmentTypeForProvider[]>([]);
  const [resultsForUpdate, setResultsForUpdate] = useState<AppointmentTypeForProvider[]>();
  const { isFetching, refetch, data } = useQuery<AppointmentTypeForProvider[]>(
    [GetAppointmentTypesForProvider, selectedProvider],
    () => getAppointmentTypesForProvider(selectedProvider!),
    {
      enabled: !!selectedProvider,
      onSuccess: data => {
        setResultsForUpdate(data);
        paginateResults(data);
        setInitialData(JSON.stringify(data));
      },
      onError: () => {
        setPagedResults([]);
        dispatch(
          addSnackbarMessage({
            message: 'configuration.appointment_types_for_providers.error_fetching_items',
            type: SnackbarType.Error,
          }),
        );
      },
    },
  );

  const paginateResults = (data: AppointmentTypeForProvider[]) => {
    if (data && data.length > 1) {
      setPaginationProperties({
        pageSize: pageSize,
        page: 1,
        totalCount: data.length,
        totalPages: Math.ceil(data.length / pageSize),
      });
      setPagedResults(data.slice(0, pageSize));
    }
  };
  const handlePageChange = (p: Paging) => {
    setPaginationProperties(p);
    if (data?.length) {
      setPagedResults(data.slice(p.pageSize * (p.page - 1), p.pageSize * p.page));
    }
  };
  const DisplayToolTip = (messages: string[], iconFillClass?: string) => {
    return (
      <ToolTipIcon icon={Icon.InfoOutline} iconFillClass={iconFillClass ?? 'rgba-05-fill'} placement='bottom-start' iconClassName='cursor-pointer icon'>
        <div className='flex flex-col p-6 w-80 normal-case'>
          {messages.map((message: string, index: number) => (
            <div key={index}>
              {' '}
              <p key={index} className='body2'>
                {t(message)}
              </p>
            </div>
          ))}
        </div>
      </ToolTipIcon>
    );
  };
  const onToggleSwitch = (selected: boolean, row: AppointmentTypeForProvider) => {
    const newResultsForUpdate = [...(data ?? [])];
    const resultForUpdate = newResultsForUpdate.find(x => x.id === row.id);
    if (resultForUpdate) {
      resultForUpdate.selected = selected;
      setResultsForUpdate(newResultsForUpdate);
    }
    const newRows = [...pagedResults];
    const updatedElement = newRows.find(x => x.id === row.id);
    if (updatedElement) {
      updatedElement.selected = selected;
      setPagedResults(newRows);
    }
  };

  const onProviderSelect = (option?: Option) => {
    if (option) {
      setSelectedProvider(+option.value);
    }
  };
  const {
    control,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = useForm({
    mode: 'all',
  });
  const saveAppointmentTypesForProvidersMutation = useMutation(saveAppointmentTypesForProvider);

  const onSubmit = (form: AppointmentTypesForProviderForm) => {
    if (resultsForUpdate) {
      const request: AppointmentTypesForProviderUpdateRequest = {
        providerId: +form.providerId,
        selectedAppointmentTypeIds: resultsForUpdate.filter(r => r.selected).map(r => r.id),
      };
      saveAppointmentTypesForProvidersMutation.mutate(request, {
        onSuccess: () => {
          dispatch(
            addSnackbarMessage({
              type: SnackbarType.Success,
              message: 'configuration.appointment_types_for_providers.save_success',
            }),
          );
        },
        onError: () => {
          dispatch(
            addSnackbarMessage({
              message: 'configuration.appointment_types_for_providers.save_error',
              type: SnackbarType.Error,
            }),
          );
        },
      });
    }
  };
  const onCancel = () => {
    if (selectedProvider) {
      refetch();
    }
  };

  const isDirty = () => {
    const resultsForUpdateStr = JSON.stringify(resultsForUpdate);
    const result = (resultsForUpdateStr === undefined ?  "" : resultsForUpdateStr) !== initialData;
    return result;
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='px-6 pt-7 flex flex-1 flex-col group overflow-y-auto'>
        <h6 className='pb-7'>{t('configuration.appointment_types_for_providers.title')}</h6>
        <p className='body2 w-4/6 whitespace-pre'>{t('configuration.appointment_types_for_providers.description')} </p>
        <div className='flex flex-row mt-5'>
          <div className='provider-selection-dropdown'>
            <ControlledSelect
              name='providerId'
              control={control}
              label='configuration.appointment_types_for_providers.provider_dropdown_label'
              options={providerOptions}
              onSelect={(option?: Option) => onProviderSelect(option)}
            />
          </div>
        </div>

        {isFetching ? (
          <Spinner className='px-2' />
        ) : (
          pagedResults &&
          pagedResults.length > 0 && (
            <>
              <div className='mb-6 ml-auto'>
                <Pagination value={paginationProperties} onChange={handlePageChange} />
              </div>
              <div className='h-12 px-4 grid-configuration head-row caption-caps'>
                <div>{t('configuration.appointment_types_for_providers.grid_appointment_id')}</div>
                <div>{t('configuration.appointment_types_for_providers.grid_appointment_name')}</div>
                <div>{t('configuration.appointment_types_for_providers.grid_description')}</div>
                <div className='flex flex-row pr-2'>
                  {t('configuration.appointment_types_for_providers.grid_allow')}
                  <span className='pl-2'>{DisplayToolTip(['configuration.appointment_types_for_providers.tooltip_allow'])}</span>
                </div>
              </div>
              {pagedResults.map(r => (
                <div key={r.id} className={classnames('grid-configuration data-row body2 black-cell', { 'not-on-emr': !r.existsOnEmr })}>
                  <div className='flex flex-row items-center h-full pl-4'>
                    {!r.existsOnEmr && <SvgIcon type={Icon.Error} fillClass='danger-icon' />}
                    <span className={classnames({ 'pl-2': !r.existsOnEmr })}>{r.id}</span>
                  </div>
                  <ElipsisTooltipTextbox value={r.name} classNames='flex items-center h-full' tooltipClass='w-1/3 whitespace-pre-wrap' />
                  <ElipsisTooltipTextbox value={r.description} classNames='flex items-center h-full body3' tooltipClass='w-1/3 whitespace-pre-wrap' />
                  <div className='flex items-center'>
                    <ToggleSwitch isChecked={r.selected} onSwitch={(newState: boolean) => onToggleSwitch(newState, r)} />
                  </div>
                </div>
              ))}
              <div className='mt-6 mb-6 ml-auto'>
                <Pagination value={paginationProperties} onChange={handlePageChange} />
              </div>
              <div className='flex flex-row mb-4'>
                <Button
                  type='submit'
                  disabled={!isDirty()}
                  buttonType='medium'
                  label='common.save'
                  isLoading={saveAppointmentTypesForProvidersMutation.isLoading}
                />
                <Button
                  label='common.cancel'
                  className=' mx-8'
                  buttonType='secondary-medium'
                  onClick={() => onCancel()}
                  disabled={saveAppointmentTypesForProvidersMutation.isLoading}
                />
              </div>
            </>
          )
        )}
      </form>
      <RouteLeavingGuard
        when={isDirty() && !isSubmitSuccessful}
        navigate={path => history.push(path)}
        title={'configuration.appointment_type_details.warning_info_leaving'}
      />
    </>
  );
};
export default ProviderAppointmentType;
