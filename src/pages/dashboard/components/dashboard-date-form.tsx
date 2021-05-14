import ControlledDateInput from '@components/controllers/ControlledDateInput';
import Button from '@components/button/button';
import React, {useState} from 'react';
import dayjs from 'dayjs';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {CalendarHorizontalAlign} from "@components/date-time-picker";

export interface DashboardDateFormProps {
    onDatesSelected: (startDate: Date, endDate: Date) => void;
}

const DashboardDateForm = ({onDatesSelected}: DashboardDateFormProps) => {

    const [selectedStartDate, setSelectedStartDate] = useState<Date>(dayjs().add(-1, 'day').toDate());
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());
    const {t} = useTranslation();
    const {handleSubmit, control, formState, watch} = useForm({
        mode: 'onBlur',
        defaultValues: {
            startDate: selectedStartDate,
            endDate: selectedEndDate
        }
    });
    const watchStartDate = watch('startDate');
    const watchEndDate = watch('endDate');


    const onSubmit = (values: any) => {
        if (isValid()) {
            setSelectedStartDate(values.startDate);
            setSelectedEndDate(values.endDate);
            onDatesSelected(values.startDate, values.endDate);
        }
    }

    const isValid = () => {
        return new Date(watchStartDate).getDate() < new Date(watchEndDate).getDate();
    }


    return <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col bg-white border-l border-b px-4 pt-4'>
            <ControlledDateInput
                label='dashboard.timeframes.start_date'
                calendarHorizontalAlign={CalendarHorizontalAlign.Left}
                required={true}
                control={control}
                name='startDate'
                dataTestId='dashboard-start-date' />
            <ControlledDateInput
                label='dashboard.timeframes.end_date'
                calendarHorizontalAlign={CalendarHorizontalAlign.Left}
                required={true}
                control={control}
                max={new Date(new Date().toDateString())}
                name='endDate'
                dataTestId='dashboard-end-date' />
            <div className='flex justify-center py-4'><Button disabled={!formState.isValid || !isValid()} type='submit'
                label={t('common.ok')} /></div>
            {!isValid() && <div className='pb-4 w-48 text-danger'>{t('dashboard.dates_error')}</div>}
        </div>
    </form>
}

export default DashboardDateForm;
