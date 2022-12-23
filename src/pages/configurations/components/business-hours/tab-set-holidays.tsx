import SvgIcon, { Icon } from '@components/svg-icon';
import { TableModel } from '@components/table/table.models';
import { FC, useState } from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import Table from '@components/table/table';
import { OperationSettingModel, WorkingHourModel, WorkingOffDateModel } from '@pages/configurations/models/business-hours-type.model';
import utils from '@shared/utils/utils';
import { HolidayModal } from './holiday-modal';
import { CurrentHolidayType } from './holiday.types';
import './business-hours.scss';

interface TabSetHolidaysProps {
  control: Control<OperationSettingModel>;
}

export const TabSetHolidays: FC<TabSetHolidaysProps> = ({ control }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentSelectedRow, setCurrentSelectedRow] = useState<CurrentHolidayType>();

  const { fields, append, remove, insert } = useFieldArray<WorkingOffDateModel>({ name: 'offDates', control: control });

  const tableModel: TableModel = {
    hasRowsBottomBorder: true,
    rows: fields ?? [],
    wrapperClassName: '',
    headerClassName: 'h-12',
    rowClass: 'h-14',
    columns: [
      {
        title: 'configuration.business_hours.holiday_table.name',
        field: 'description',
        widthClass: 'holiday-table-name mr-8',
        rowClassname: 'subtitle2',
        render: (value: string) => {
          return <span className='flex items-center h-full'>{value}</span>;
        },
      },
      {
        title: 'configuration.business_hours.holiday_table.start_date_name',
        field: 'startDateTime',
        widthClass: 'w-20 mr-8',
        rowClassname: 'subtitle2',
        render: (value: Date) => {
          return <span className='flex items-center h-full'>{utils.formatUtcDate(value, 'MMM DD')}</span>;
        },
      },
      {
        title: 'configuration.business_hours.holiday_table.start_time_name',
        field: 'startDateTime',
        widthClass: 'w-20 mr-36',
        rowClassname: 'subtitle2',
        render: (value: Date) => {
          return <span className='flex items-center h-full'>{utils.formatUtcDate(value, 'h:mm A')}</span>;
        },
      },
      {
        title: 'configuration.business_hours.holiday_table.end_date_name',
        field: 'endDateTime',
        widthClass: 'w-20 mr-8',
        rowClassname: 'subtitle2',
        render: (value: Date) => {
          return <span className='flex items-center h-full'>{utils.formatUtcDate(value, 'MMM DD')}</span>;
        },
      },
      {
        title: 'configuration.business_hours.holiday_table.end_time_name',
        field: 'endDateTime',
        widthClass: 'w-20 mr-40',
        rowClassname: 'subtitle2',
        render: (value: Date) => {
          return <span className='flex items-center h-full'>{utils.formatUtcDate(value, 'h:mm A')}</span>;
        },
      },
      {
        title: '',
        field: 'id',
        alignment: 'start',
        widthClass: 'w-10 flex items-center justify-center h-full',
        render: (value: string, row: WorkingOffDateModel) => {
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

  const handleModalSave = (value: WorkingOffDateModel) => {
    append(value);
    handleModalClose();
  };

  const handleModalUpdate = (item: CurrentHolidayType) => {
    const idx = fields.findIndex(p => item.id === p.id);
    remove(idx);
    insert(idx, item.value);
    handleModalClose();
  };

  const handleModelDelete = (item: CurrentHolidayType) => {
    const idx = fields.findIndex(p => item.id === p.id);
    remove(idx);
    handleModalClose();
  };

  return (
    <>
      <HolidayModal
        data={currentSelectedRow}
        isVisible={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        onUpdate={handleModalUpdate}
        onDelete={handleModelDelete}
      />
      <div className='mt-6'>
        <p>{t('configuration.business_hours.description_holiday')}</p>
        <div className='mt-3'>
          <div className='flex flex-row justify-between w-full h-14'>
            <div className='flex flex-col justify-end  ml-4 mb-2.5'>
              <div className='h7'>{t('configuration.business_hours.holidays_schedule')}</div>
            </div>
            <div className='flex flex-col justify-center mr-8'>
              <Button data-testid='add' type='button' label='configuration.business_hours.add_holiday' buttonType='small' onClick={handleAddHoursClick} />
            </div>
          </div>
          <Table model={tableModel} />
        </div>
      </div>
    </>
  );
};
