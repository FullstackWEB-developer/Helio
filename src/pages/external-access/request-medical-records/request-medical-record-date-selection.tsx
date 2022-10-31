import React, {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {useForm} from 'react-hook-form';
import {INPUT_DATE_FORMAT} from '@constants/form-constants';
import ControlledInput from '../../../shared/components/controllers/ControlledInput';
import {useTranslation} from 'react-i18next';

export interface RequestMedicalRecordDateSelectionProps {
    dateSelected: (fieldName: string, date: Date | undefined) => void;
}

const RequestMedicalRecordDateSelection = ({dateSelected}: RequestMedicalRecordDateSelectionProps) => {

    const {t} = useTranslation();
    const [startDateErrorMessage, setStartDateErrorMessage] = useState<string>('');
    const {control, watch} = useForm({
        mode: 'onBlur',
        defaultValues: {
            startDate: dayjs().add(-1, 'month').format('MM/DD/YYYY'),
            endDate: dayjs().format('MM/DD/YYYY')
        }
    });

    const watchStartDate = watch('startDate');
    const watchEndDate = watch('endDate');
    const onDateSelected = (fieldName: string, value: string | undefined) => {
        if (value && !value.includes('mm')) {
            const date = dayjs(value).toDate();
            dateSelected(fieldName, date);
        } else {
            dateSelected(fieldName, undefined);
        }
    }

    useEffect(() => {
        control.trigger();
        dateSelected('startDate', dayjs().add(-1, 'month').toDate());
        dateSelected('endDate', dayjs().toDate());
    }, [control?.formState.errors]);

    useEffect(() => {
        const startDate = dayjs(watchStartDate).toDate();
        const endDate = dayjs(watchEndDate).toDate();
        if (startDate > endDate) {
            setStartDateErrorMessage(t('external_access.medical_records_request.invalid_start_date_after_end_date'));
        } else {
            setStartDateErrorMessage('');
        }
    }, [watchStartDate, watchEndDate])

    return <form>
        <div className='flex flex-col md:flex-row bg-white w-80 px-4 pt-4'>
            <ControlledInput
                type='date'
                required={true}
                errorMessage={startDateErrorMessage}
                invalidErrorMessage={t('external_access.medical_records_request.invalid_start_date', {'format': INPUT_DATE_FORMAT })}
                label='external_access.medical_records_request.start_date'
                assistiveText={INPUT_DATE_FORMAT}
                onBlur={(event) => {onDateSelected('startDate', event.target.value || undefined)}}
                control={control}
                name='startDate'
                className='w-full md:w-40 md:mr-8'
                data-testid='medical-records-start-date' />

            <ControlledInput
                type='date'
                required={true}
                invalidErrorMessage={t('external_access.medical_records_request.invalid_end_date', {'format': INPUT_DATE_FORMAT })}
                label='external_access.medical_records_request.end_date'
                assistiveText={INPUT_DATE_FORMAT}
                onBlur={(event) => {onDateSelected('endDate', event.target.value || undefined)}}
                control={control}
                name='endDate'
                className='w-full md:w-40'
                data-testid='medical-records-end-date' />
        </div>
    </form>
}

export default RequestMedicalRecordDateSelection;
