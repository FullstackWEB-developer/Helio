import ControlledDateInput from '@components/controllers/ControlledDateInput';
import React, {useState} from 'react';
import dayjs from 'dayjs';
import {useForm} from 'react-hook-form';
import {CalendarHorizontalAlign} from "@components/date-time-picker";

export interface RequestMedicalRecordDateSelectionProps {
    dateSelected: (fieldName: string, date: Date) => void;
}

const RequestMedicalRecordDateSelection = ({dateSelected}: RequestMedicalRecordDateSelectionProps) => {

    const [selectedStartDate, setSelectedStartDate] = useState<Date>(dayjs().add(-1, 'month').toDate());
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());
    const {control, watch} = useForm({
        mode: 'onBlur',
        defaultValues: {
            startDate: selectedStartDate,
            endDate: selectedEndDate
        }
    });
    const watchStartDate = watch('startDate');
    const watchEndDate = watch('endDate');

    const onDateSelected = (fieldName: string, value: Date | undefined) => {
        if (value) {
            dateSelected(fieldName, value);
        }
    }

    return <form>
        <div className='flex flex-col bg-white w-80 px-4 pt-4'>
            <ControlledDateInput
                label='external_access.medical_records_request.start_date'
                calendarHorizontalAlign={CalendarHorizontalAlign.Left}
                required={true}
                control={control}
                max={watchEndDate}
                value={selectedStartDate}
                onChange={(value) => {onDateSelected('startDate', value); value && setSelectedStartDate(value)}}
                name='startDate'
                dataTestId='medical-records-start-date'
                isSmallSize={true}/>
            <ControlledDateInput
                label='external_access.medical_records_request.end_date'
                calendarHorizontalAlign={CalendarHorizontalAlign.Left}
                required={true}
                control={control}
                value={selectedEndDate}
                onChange={(value) => {onDateSelected('endDate', value); value && setSelectedEndDate(value)}}
                min={watchStartDate}
                max={new Date()}
                name='endDate'
                dataTestId='medical-records-end-date'
                isSmallSize={true}/>
        </div>
    </form>
}

export default RequestMedicalRecordDateSelection;
