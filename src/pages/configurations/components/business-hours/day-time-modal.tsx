import Button from '@components/button/button';
import { ControlledSelect } from '@components/controllers';
import Modal from '@components/modal/modal';
import { WorkingHourModel } from '@pages/configurations/models/business-hours-type.model';
import { DayOfWeek } from '@shared/models/DayOfWeek';
import { FC, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Option } from '@components/option/option';
import utils from '@shared/utils/utils';
import { CurrentWorkingHourType } from './business-hours.types';
import './business-hours.scss';

interface DayTimeModalProps {
  data?: CurrentWorkingHourType;
  isVisible?: boolean;
  onClose?: () => void;
  onSave: (value: WorkingHourModel) => void;
  onUpdate: (value: CurrentWorkingHourType) => void;
  onDelete: (value: CurrentWorkingHourType) => void;
}

export const DayTimeModal: FC<DayTimeModalProps> = ({ data, isVisible = false, onClose, onDelete, onSave, onUpdate }) => {
  const { control, handleSubmit, reset, setValue } = useForm<WorkingHourModel>({});

  const { t } = useTranslation();

  useEffect(() => {
    if (!data) {
      reset({});
    } else {
      reset(data?.value);
    }
  }, [data, reset]);

  const daysOfWeek = useMemo((): Option[] => {
    return Object.entries(DayOfWeek)
      .filter(([key, _]) => isNaN(Number(key)))
      .map(([key, value]) => ({
        label: t(`configuration.business_hours.dayOfWeek.${key.toLowerCase()}`),
        value: value.toString(),
      }));
  }, [t]);

  const hours = useMemo(() => {
    return utils.parseOptions(
      utils.getListOfHours(true),
      label => utils.convertTime24To12(label),
      value => value,
    );
  }, []);

  const handleUpdate = (formData: WorkingHourModel) => {
    onUpdate({ id: data?.id ?? '', value: formData });
  };

  const handleDelete = () => {
    if (!data) {
      return;
    }
    onDelete(data);
  };

  return (
    <Modal
      title={!data ? t('configuration.business_hours.add_day_hour_title') : t('configuration.business_hours.edit_day_hour_title')}
      className='business-hours-add'
      isOpen={isVisible}
      closeableOnEscapeKeyPress={isVisible}
      isClosable
      hasOverlay
      isDraggable
      onClose={onClose}
    >
      <div className='flex flex-col pb-6 pt-4'>
        <ControlledSelect
          className='day-select'
          name='day'
          control={control}
          label={t('configuration.business_hours.day_select_label')}
          options={daysOfWeek}
          defaultValue={data ? data.value.day.toString() : undefined}
          onSelect={(option?: Option) => {
            if (!option) {
              return;
            }
            setValue('day', Number(option.value));
          }}
        />
        <div className='flex flex-row'>
          <div className='flex flex-col mr-8'>
            <ControlledSelect
              name='startTime'
              control={control}
              className='time-select'
              label={t('configuration.business_hours.start_time_select_label')}
              options={hours}
            />
          </div>
          <div className='flex flex-col'>
            <ControlledSelect
              name='endTime'
              control={control}
              className='time-select'
              label={t('configuration.business_hours.end_time_select_label')}
              options={hours}
            />
          </div>
        </div>
        <div className='flex justify-end mt-10'>
          <Button data-testid='cancel-department' label='common.cancel' className='mr-6' buttonType='secondary' onClick={onClose} />
          {!!data && <Button data-testid='delete-department' label='common.delete' className='mr-6' buttonType='secondary' onClick={handleDelete} />}
          <Button data-testid='save-changes' type='button' buttonType='small' label='common.save' onClick={handleSubmit(!data ? onSave : handleUpdate)} />
        </div>
      </div>
    </Modal>
  );
};
