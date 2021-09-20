import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {selectLocationList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import {useQuery} from 'react-query';
import {AppointmentSlotRequest, AppointmentType} from '@pages/external-access/appointment/models';
import {AxiosError} from 'axios';
import {GetAppointmentTypesForPatient} from '@constants/react-query-constants';
import {getAppointmentTypesForPatient} from '@pages/appointments/services/appointments.service';
import {getLocations, getProviders} from '@shared/services/lookups.service';
import Spinner from '@components/spinner/Spinner';
import ControlledSelect from '../../../shared/components/controllers/controlled-select';
import {useForm} from 'react-hook-form';
import utils from '@shared/utils/utils';
import Button from '@components/button/button';
import Radio from '@components/radio/radio';
import {Option} from '@components/option/option';
import {ControlledDateInput} from '@components/controllers';
import {useHistory} from 'react-router-dom';
import {setAppointmentSlotRequest} from './store/appointments.slice';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';

const AppointmentSchedule = () => {
    dayjs.extend(utc);
    dayjs.extend(isoWeek);

    enum TimePreference {
        FirstAvailable = 1,
        PreferredDate
    }

    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();

    const verifiedPatient = useSelector(selectVerifiedPatent);

    const providers = useSelector(selectProviderList);
    const locations = useSelector(selectLocationList);
    const [timePreference, setTimePreference] = useState<TimePreference>(TimePreference.FirstAvailable);

    const {handleSubmit, control, formState} = useForm({mode: 'all'});
    const {isValid} = formState;

    const {isLoading: appointmentTypesLoading, data: appointmentTypes} = useQuery<AppointmentType[], AxiosError>([GetAppointmentTypesForPatient],
        () => getAppointmentTypesForPatient(verifiedPatient.patientId, verifiedPatient.primaryProviderId || verifiedPatient.defaultProviderId),
        {
            enabled: !!verifiedPatient
        });

    useEffect(() => {
        dispatch(getProviders());
        dispatch(getLocations());
    }, [dispatch]);

    const locationOptions = useMemo(() => utils.parseOptions(locations,
        item => item.name,
        item => item.id.toString()
    ), [locations]);

    const appointmentTypeOptions = useMemo(() => utils.parseOptions(appointmentTypes || [],
        item => item.name,
        item => item.id.toString(),
        item => item.description || ''
    ), [appointmentTypes]);

    const providerOptions = useMemo(() => utils.parseOptions(providers,
        item => utils.stringJoin(' ', item.firstName, item.lastName),
        item => item.id.toString()
    ), [providers]);

    if (!verifiedPatient) {
        return <div>{t('external_access.not_verified_patient')}</div>;
    }

    if (appointmentTypesLoading || !appointmentTypes || !providers || providers.length === 0 || !locations || locations.length === 0) {
        return <Spinner fullScreen />
    }


    const onSubmit = (formData: any) => {
        const beginDate: Date = timePreference === TimePreference.FirstAvailable ? new Date() : formData.date;

        const request: AppointmentSlotRequest = {
            appointmentTypeId: Number(formData.appointment_type),
            departmentId: Number(formData.location),
            providerId: [Number(formData.provider)],
            startDate: beginDate,
            itemCount: 100,
            endDate: dayjs(beginDate).utc().add(14, 'day').toDate(),
            allowMultipleDepartment: true
        }
        dispatch(setAppointmentSlotRequest(request));

        history.push('/o/appointment-schedule/select');
    }

    const timePreferences: Option[] = [
        {
            label: 'external_access.schedule_appointment.first_available',
            value: TimePreference.FirstAvailable.toString(),
            object: TimePreference.FirstAvailable
        },
        {
            label: 'external_access.schedule_appointment.select_preferred',
            value: TimePreference.PreferredDate.toString(),
            object: TimePreference.PreferredDate
        }
    ];

    return <div className='flex flex-col'>
        <h4 className='pb-9'>{t('external_access.schedule_appointment.what_you_are_coming_for')}</h4>
        <div className='pb-10'>{t('external_access.schedule_appointment.what_you_are_coming_for_desc')}</div>
        <div className='w-88'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
                <ControlledSelect
                    name='appointment_type'
                    label='external_access.schedule_appointment.appointment_type'
                    options={appointmentTypeOptions}
                    truncateAssistiveText={true}
                    control={control}
                    required={true}
                />
                <ControlledSelect
                    name='provider'
                    label='external_access.schedule_appointment.provider'
                    options={providerOptions}
                    control={control}
                />
                <ControlledSelect
                    name='location'
                    label='external_access.schedule_appointment.location'
                    options={locationOptions}
                    control={control}
                />
                <div className='pt-6'>
                    <div className='pb-5 body2'>{t('external_access.schedule_appointment.select_preference')}</div>
                    <Radio
                        name='time_preference'
                        items={timePreferences}
                        onChange={(_, obj) => setTimePreference(obj)} />
                </div>

                {timePreference === TimePreference.PreferredDate &&
                    <div className='w-40'>
                        <ControlledDateInput
                            label='external_access.schedule_appointment.select_date'
                            control={control}
                            name='date' />
                    </div>}

                <div className='flex justify-start pt-8'>
                    <Button
                        isLoading={false}
                        disabled={!isValid}
                        type={'submit'}
                        buttonType='big'
                        label={'external_access.schedule_appointment.find_appointment'} />
                </div>
            </form>
        </div>
    </div>
}

export default AppointmentSchedule;
