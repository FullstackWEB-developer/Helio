import ControlledDateInput from '@components/controllers/ControlledDateInput';
import Button from '@components/button/button';
import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {CalendarHorizontalAlign} from "@components/date-time-picker";

export interface DashboardDateFormProps {
    onDatesSelected: (startDate: Date, endDate: Date) => void;
    resetTrigger?: Date;
}

const DashboardDateForm = ({onDatesSelected, resetTrigger}: DashboardDateFormProps) => {
    const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>();
    const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>();
    const {t} = useTranslation();
    const {handleSubmit, control, formState, watch} = useForm({
        mode: 'onBlur',
        defaultValues: {
            startDate: selectedStartDate,
            endDate: selectedEndDate
        }
    });

    useEffect(() => {
        setSelectedStartDate(undefined);
        setSelectedEndDate(undefined);
    }, [resetTrigger])

    const watchStartDate = watch('startDate');
    const watchEndDate = watch('endDate');


    const onSubmit = (values: {startDate: Date, endDate: Date}) => {
        if (isValid()) {
            setSelectedStartDate(values.startDate);
            setSelectedEndDate(values.endDate);
            onDatesSelected(values.startDate, values.endDate);
        }
    }

    const isValid = () => {
        if (!watchStartDate || !watchEndDate) {
            return true;
        }
        return dayjs(watchStartDate).isBefore(watchEndDate) || dayjs(watchStartDate).isSame(dayjs(watchEndDate), 'day');
    }


    return <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col bg-white border-l border-b px-4 pt-4'>
            <ControlledDateInput
                label='dashboard.timeframes.start_date'
                calendarHorizontalAlign={CalendarHorizontalAlign.Left}
                required={true}
                control={control}
                value={selectedStartDate}
                max={new Date()}
                name='startDate'
                onChange={(value) => setSelectedStartDate(value)}
                dataTestId='dashboard-start-date'
                isSmallSize={true} />
            <ControlledDateInput
                label='dashboard.timeframes.end_date'
                calendarHorizontalAlign={CalendarHorizontalAlign.Left}
                required={true}
                value={selectedEndDate}
                onChange={(value) => setSelectedEndDate(value)}
                control={control}
                max={new Date()}
                name='endDate'
                dataTestId='dashboard-end-date'
                isSmallSize={true} />
            <div className='flex justify-center py-4'><Button disabled={!formState.isValid || !isValid()} type='submit'
                label={t('common.ok')} /></div>
            {!isValid() && <div className='pb-4 w-48 text-danger'>{t('dashboard.dates_error')}</div>}
        </div>
    </form>
}

export default DashboardDateForm;
