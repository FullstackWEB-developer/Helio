import Button from '@components/button/button';
import { ControlledDateInput, ControlledInput, ControlledSelect } from '@components/controllers';
import Modal from '@components/modal/modal';
import { WorkingOffDateModel } from '@pages/configurations/models/business-hours-type.model';
import { FC, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import utils from '@shared/utils/utils';
import { CurrentHolidayType } from './holiday.types';
import './business-hours.scss';
import dayjs from 'dayjs';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { useDispatch } from 'react-redux';
interface HolidayModalProps {
  data?: CurrentHolidayType;
  isVisible?: boolean;
  onClose?: () => void;
  onSave: (value: WorkingOffDateModel) => void;
  onUpdate: (value: CurrentHolidayType) => void;
  onDelete: (value: CurrentHolidayType) => void;
}

export const HolidayModal: FC<HolidayModalProps> = ({ data, isVisible = false, onClose, onDelete, onSave, onUpdate }) => {
  const { control, handleSubmit, reset, formState, setValue } = useForm({ mode: 'onChange' });
  const { isDirty, isValid: isFormValid } = formState;
  const [startDate, setStartDate] = useState<Date | undefined>(data ? data.value.startDateTime as unknown as Date : undefined);
  const [startTime, setStartTime] = useState<string | undefined>(data ? utils.formatUtcDate((data.value.startDateTime as unknown as Date), 'HH:mm') : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(data ? data.value.endDateTime as unknown as Date : undefined);
  const [endTime, setEndTime] = useState<string | undefined>(data ? utils.formatUtcDate((data.value.endDateTime as unknown as Date), 'HH:mm') : undefined);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (!data) {
      reset({});
    } else {
      setStartDate(data.value.startDateTime as unknown as Date)
      setEndDate(data.value.endDateTime as unknown as Date)
      reset({
        "description": data.value.description,
        "startDate": data.value.startDateTime as unknown as Date,
        "endDate": data.value.endDateTime as unknown as Date,
      });
    }
  }, [data, reset]);

  const hours = useMemo(() => {
    return utils.parseOptions(
      utils.getListOfHours(true),
      label => utils.convertTime24To12(label),
      value => value,
    );
  }, []);

  const handleSave = (formData: any) => {
    if(isValid()){
      let data: WorkingOffDateModel = {
        description: formData.description,
        startDateTime: getDateTime(formData.startDate, formData.startTime),
        endDateTime: getDateTime(formData.endDate, formData.endTime),
      }
      setStartDate(undefined)
      setEndDate(undefined)
      onSave(data);
    }else{
      dispatch(addSnackbarMessage({
        message:'configuration.business_hours.end_date_cannot_be_before_start_date',
        type: SnackbarType.Error
      }))
    }
  };

  const handleUpdate = (formData: any) => {
    if(isValid()){
      let updatedData: WorkingOffDateModel = {
        description: formData.description,
        startDateTime: getDateTime(formData.startDate, formData.startTime),
        endDateTime: getDateTime(formData.endDate, formData.endTime),
      }
      setStartDate(undefined)
      setEndDate(undefined)
      onUpdate({ id: data?.id ?? '', value: updatedData });
    }else{
      dispatch(addSnackbarMessage({
        message:'configuration.business_hours.end_date_cannot_be_before_start_date',
        type: SnackbarType.Error
      }))
    }
  };

  const getDateTime = (date: any, time: string) => {
     let timeArray = time.split(':');
     let formattedDate: string; 
     
     if(date instanceof Date){
        formattedDate = dayjs(date).format('YYYY-MM-DD')
     }else{
        formattedDate = date.split('T')[0]
     }
     
     return dayjs(formattedDate).add(Number(timeArray[0]), 'hours').add(Number(timeArray[1]), 'minutes').utc().format()
  }

  const getDateTimeObject = (date: any, time: string = '00:00') => {
    if(!date)
        return undefined;
    let timeArray = time.split(':');
    let formattedDate: string; 
    
    if(date instanceof Date){
       formattedDate = dayjs(date).format('YYYY-MM-DD')
    }else{
       formattedDate = date.split('T')[0]
    }
    
    return dayjs(formattedDate).add(Number(timeArray[0]), 'hours').add(Number(timeArray[1]), 'minutes').utc().toDate()
 }

  const handleDelete = () => {
    if (!data) {
      return;
    }
    setStartDate(undefined)
    setEndDate(undefined)
    onDelete(data);
  };

  const handleClose = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    onClose && onClose();
  }

  const isValid = () => {
    if (!startDate || !endDate) {
        return true;
    }

    if (dayjs(startDate).isSame(endDate)){
      return true
    }
    return dayjs(startDate).isBefore(endDate);
  }

  return (
    <Modal
      title={!data ? t('configuration.business_hours.add_holiday_title') : t('configuration.business_hours.edit_holiday_title')}
      className='business-hours-add'
      isOpen={isVisible}
      closeableOnEscapeKeyPress={true}
      isClosable
      hasOverlay
      isDraggable
      onClose={handleClose}
    >
      <div className='flex flex-col pb-6 pt-4'>
        <ControlledInput
          control={control}
          name='description'
          className='holiday-modal-input'
          type='text'
          defaultValue={data ? data.value.description?.toString() : undefined}
          label='configuration.business_hours.holiday_name'
          errorMessage={dayjs(startDate).isAfter(endDate) ? t('configuration.business_hours.end_date_cannot_be_before_start_date') : ''}
          required
        />
        <div className='flex flex-row'>
          <div className='flex flex-col mr-8'>
            <ControlledDateInput
              control={control}
              className='holiday-date-select'
              type='date'
              value={startDate}
              onChange={(e) => {setStartDate(getDateTimeObject(e, startTime ? startTime : '00:00'));}}
              isCalendarPositionComputed
              label={t('configuration.business_hours.start_date_select_label')}
              name='startDate'
              isSmallSize={true}
              required
            />
          </div>
          <div className='flex flex-col'>
            <ControlledSelect
              name='startTime'
              control={control}
              className='holiday-date-select'
              label={t('configuration.business_hours.start_time_select_label')}
              onSelect={(e) => {setStartTime(e ? e.value : undefined); setStartDate(getDateTimeObject(startDate, e ? e.value : '00:00'));}}
              defaultValue={data ? utils.formatUtcDate((data.value.startDateTime as unknown as Date), 'HH:mm') : undefined}
              options={hours}
              onTextChange={(e) => {if(e === '') {setValue('startTime',''); setStartTime(undefined); setStartDate(getDateTimeObject(startDate, '00:00'));}}}
              required
            />
          </div>
        </div>
        <div className='flex flex-row'>
          <div className='flex flex-col mr-8'>
            <ControlledDateInput
              control={control}
              className='holiday-date-select'
              type='date'
              value={endDate}
              onChange={(e) => {setEndDate(getDateTimeObject(e, endTime ? endTime : '00:00'));}}
              isCalendarPositionComputed
              label={t('configuration.business_hours.end_date_select_label')}
              name='endDate'
              isSmallSize={true}
              required
            />
          </div>
          <div className='flex flex-col'>
            <ControlledSelect
              name='endTime'
              control={control}
              className='holiday-date-select'
              label={t('configuration.business_hours.end_time_select_label')}
              defaultValue={data ? utils.formatUtcDate((data.value.endDateTime as unknown as Date), 'HH:mm') : undefined}
              options={hours}
              onTextChange={(e) => {if(e === '') {setValue('endTime',''); setEndTime(undefined); setEndDate(getDateTimeObject(endDate, '00:00'));}}}
              onSelect={(e) => {setEndTime(e ? e.value : undefined); setEndDate(getDateTimeObject(endDate, e ? e.value : '00:00'));}}
              required
            />
          </div>
        </div>
        <div className='flex justify-end mt-10'>
          <Button data-testid='cancel-holiday-add' label='common.cancel' className='mr-6' buttonType='secondary' onClick={onClose} disabled={!isDirty} />
          {!!data && <Button data-testid='delete-holiday' label='common.delete' className='mr-6' buttonType='secondary' onClick={handleDelete} />}
          {!isValid() || !isFormValid || !isDirty}
          <Button data-testid='save-holiday-changes' type='button' buttonType='small' label='common.save' onClick={handleSubmit(!data ? handleSave : handleUpdate)} disabled={!isValid() || !isFormValid || !isDirty} />
        </div>
      </div>
    </Modal>
  );
};
