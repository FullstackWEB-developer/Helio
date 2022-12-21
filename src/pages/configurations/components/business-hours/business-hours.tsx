import Button from '@components/button/button';
import Spinner from '@components/spinner/Spinner';
import Tabs, { Tab } from '@components/tab';
import { GetOperationSettings } from '@constants/react-query-constants';
import { OperationSettingModel } from '@pages/configurations/models/business-hours-type.model';
import { getOperationSettings, saveOperationSettings } from '@shared/services/lookups.service';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { TabSetBusinessHours } from './tab-set-business-hours';
import './business-hours.scss';
import { useDispatch } from 'react-redux';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';

const BusinessHours: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { control, formState, reset, handleSubmit, watch } = useForm<OperationSettingModel>({ mode: 'all' });
  const { isDirty, isValid } = formState;

  const workingHoursWatch = watch('workingHours');

  const { data, isLoading } = useQuery([GetOperationSettings], () => getOperationSettings(), {
    enabled: true,
    onSuccess: response => {
      reset(response);
    },
  });

  const saveOperationSettingsMutation = useMutation(saveOperationSettings, {
    onSuccess: data => {
      reset(data);

      dispatch(
        addSnackbarMessage({
          type: SnackbarType.Success,
          message: 'configuration.business_hours.save_success',
        }),
      );
    },
    onError: () => {
      dispatch(
        addSnackbarMessage({
          message: 'configuration.business_hours.save_error',
          type: SnackbarType.Error,
        }),
      );
    },
  });

  const handleCancel = () => {
    reset();
  };

  const onSubmit = (formData: OperationSettingModel) => {
    formData.workingHours = workingHoursWatch;
    const newData: OperationSettingModel = { ...data, ...formData, workingHours: workingHoursWatch };
    saveOperationSettingsMutation.mutate(newData);
  };

  if (isLoading) {
    return <Spinner fullScreen />;
  }

  return (
    <div className='h-full pr-4 overflow-auto business-hours'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col flex-1 px-6 py-6 overflow-y-auto body2'>
        <h5 className='mb-4'>{t('configuration.business_hours.title')}</h5>
        <Tabs>
          <Tab title={t('configuration.business_hours.tab_general_settings_title')}>
            <div />
          </Tab>
          <Tab title={t('configuration.business_hours.tab_set_business_hours_title')}>
            <TabSetBusinessHours control={control} />
          </Tab>
          <Tab title={t('configuration.business_hours.tab_set_holidays')}>
            <div />
          </Tab>
        </Tabs>
        <div className='flex justify-start mt-10'>
          <Button
            data-testid='save-changes'
            type='submit'
            buttonType='medium'
            label='common.save'
            isLoading={saveOperationSettingsMutation.isLoading}
            disabled={!isDirty || !isValid}
          />
          <Button
            data-testid='cancel-configurations'
            label='common.cancel'
            className='ml-6'
            buttonType='secondary'
            disabled={!isDirty}
            onClick={handleCancel}
          />
        </div>
      </form>
    </div>
  );
};

export default BusinessHours;
