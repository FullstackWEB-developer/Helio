import Radio from '@components/radio/radio';
import SvgIcon, { Icon } from '@components/svg-icon';
import { TableModel } from '@components/table/table.models';
import { FC, useState } from 'react';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Option } from '@components/option/option';
import Button from '@components/button/button';
import Table from '@components/table/table';
import { OperationSettingModel, WorkingHourModel, WorkingHoursType } from '@pages/configurations/models/business-hours-type.model';
import { DayOfWeek } from '@shared/models/DayOfWeek';
import utils from '@shared/utils/utils';
import { DayTimeModal } from './day-time-modal';
import { CurrentWorkingHourType } from './business-hours.types';
import MoreLessText from '@components/more-less-text/MoreLessText';
import './business-hours.scss';

interface TabSetBusinessHoursProps {
  control: Control<OperationSettingModel>;
}

export const TabSetBusinessHours: FC<TabSetBusinessHoursProps> = ({ control }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentSelectedRow, setCurrentSelectedRow] = useState<CurrentWorkingHourType>();

  const { fields, append, remove, insert } = useFieldArray<WorkingHourModel>({ name: 'workingHours', control: control });

  const workingHoursTypeOptions: Option[] = [
    {
      value: WorkingHoursType._24_7.toString(),
      label: t('configuration.business_hours.types.24_7'),
    },
    {
      value: WorkingHoursType.Custom.toString(),
      label: t('configuration.business_hours.types.custom_business_hours'),
    },
  ];

  const tableModel: TableModel = {
    hasRowsBottomBorder: true,
    rows: fields ?? [],
    wrapperClassName: '',
    headerClassName: 'h-12',
    rowClass: 'h-14',
    columns: [
      {
        title: 'configuration.business_hours.table.day_name',
        field: 'day',
        widthClass: 'w-80',
        rowClassname: 'subtitle2',
        render: (value: DayOfWeek) => {
          return <span className='flex items-center h-full'>{t(`configuration.business_hours.dayOfWeek.${DayOfWeek[value].toString().toLowerCase()}`)}</span>;
        },
      },
      {
        title: 'configuration.business_hours.table.start_time_name',
        field: 'startTime',
        widthClass: 'w-60',
        rowClassname: 'subtitle2',
        render: (value: string) => {
          return <span className='flex items-center h-full'>{utils.convertTime24To12(value)}</span>;
        },
      },
      {
        title: 'configuration.business_hours.table.end_time_name',
        field: 'endTime',
        widthClass: 'w-full',
        rowClassname: 'subtitle2',
        render: (value: string) => {
          return <span className='flex items-center h-full'>{utils.convertTime24To12(value)}</span>;
        },
      },
      {
        title: '',
        field: 'id',
        alignment: 'start',
        widthClass: 'w-10 flex items-center justify-center h-full mr-4',
        render: (value: string, row: WorkingHourModel) => {
          return (
            <SvgIcon
              dataTestId={`edit-${value}`}
              type={Icon.Edit}
              className='cursor-pointer icon-medium'
              fillClass='edit-icon'
              onClick={() => {
                setCurrentSelectedRow({ id: value, value: row });
                setIsModalOpen(true);
              }}
            />
          );
        },
      },
    ],
  };

  const handleModalClose = () => {
    setCurrentSelectedRow(undefined);
    setIsModalOpen(false);
  };

  const handleAddHoursClick = () => {
    setIsModalOpen(true);
  };

  const handleModalSave = (value: WorkingHourModel) => {
    append(value);
    handleModalClose();
  };

  const handleModalUpdate = (item: CurrentWorkingHourType) => {
    const idx = fields.findIndex(p => item.id === p.id);
    remove(idx);
    insert(idx, item.value);
    handleModalClose();
  };

  const handleModelDelete = (item: CurrentWorkingHourType) => {
    const idx = fields.findIndex(p => item.id === p.id);
    remove(idx);
    handleModalClose();
  };

  return (
    <>
      <DayTimeModal
        data={currentSelectedRow}
        isVisible={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        onUpdate={handleModalUpdate}
        onDelete={handleModelDelete}
      />
      <div className='mt-6'>
        <p>{t('configuration.business_hours.description')}</p>
        <div className='pb-2 subtitle2 pt-7'>{t('configuration.business_hours.title')}</div>
        <div className='flex flex-col mr-4'>
          <Controller
            name='workingHoursType'
            control={control}
            render={({ value, onChange, ...controllerProps }) => (
              <Radio
                {...controllerProps}
                value={value?.toString()}
                className='flex mt-2 space-x-56'
                items={workingHoursTypeOptions}
                onChange={(e: string) => {
                  onChange(Number(e));
                }}
              />
            )}
          />
        </div>
        <div className='mt-9'>
          <div className='subtitle2'>{t('configuration.business_hours.enter_hours_title')}</div>
          <MoreLessText
            className='mt-2 body3-medium whitespace-pre-line more-less-text'
            characterLimit={164}
            text='configuration.business_hours.enter_hours_description'
          />
        </div>
        <div className='mt-10'>
          <div className='flex flex-row justify-between w-full h-14'>
            <div className='flex flex-col justify-end  ml-4 mb-2.5'>
              <div className='h7'>{t('configuration.business_hours.title')}</div>
            </div>
            <div className='flex flex-col justify-center mr-8'>
              <Button data-testid='add' type='button' label='configuration.business_hours.add_date_time' buttonType='small' onClick={handleAddHoursClick} />
            </div>
          </div>
          <Table model={tableModel} />
        </div>
      </div>
    </>
  );
};
