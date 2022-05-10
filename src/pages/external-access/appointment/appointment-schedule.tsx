import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import {selectLocationList, selectProviderList} from '@shared/store/lookups/lookups.selectors';
import {useQuery} from 'react-query';
import {Appointment, AppointmentSlotRequest, AppointmentType} from '@pages/external-access/appointment/models';
import {AxiosError} from 'axios';
import {GetAppointmentTypesForPatient, GetPatientAppointments} from '@constants/react-query-constants';
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
import {setAppointmentSlotRequest, setPatientUpcomingAppointment} from './store/appointments.slice';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';
import {getAppointments} from '@pages/patients/services/patients.service';
import {AppointmentFoundPath} from '@app/paths';

const AppointmentSchedule = () => {
    dayjs.extend(utc);
    dayjs.extend(isoWeek);
    const {t} = useTranslation();
    const DEFAULT_OPTION_ANY: Option = useMemo(() => ({
        label: t('common.any'),
        value: '0'
    }), [t]);
    enum TimePreference {
        FirstAvailable = 1,
        PreferredDate
    }

    const dispatch = useDispatch();
    const history = useHistory();

    const verifiedPatient = useSelector(selectVerifiedPatent);

    const providers = useSelector(selectProviderList);
    const locations = useSelector(selectLocationList);
    const [timePreference, setTimePreference] = useState<TimePreference>(TimePreference.FirstAvailable);

    const {handleSubmit, control, formState} = useForm({mode: 'all'});
    const {isValid} = formState;
    const hasUpcomingAppointment = (history.location.state as any)?.hasUpcomingAppointment ?? false

    const {isLoading: appointmentTypesLoading, data: appointmentTypes} = useQuery<AppointmentType[], AxiosError>([GetAppointmentTypesForPatient],
        () => getAppointmentTypesForPatient(verifiedPatient.patientId),
        {
            enabled: !!verifiedPatient
        });

    const {isLoading: isUpcommingAppointmentLoading} = useQuery<Appointment[], AxiosError>([GetPatientAppointments, verifiedPatient?.patientId], () =>
        getAppointments(verifiedPatient.patientId),
        {
            enabled: !!verifiedPatient && !!appointmentTypes && !hasUpcomingAppointment,
            onSuccess: (data) => {
                if (!data || data.length === 0) {
                    return;
                }

                const upcoming = utils.sortBy(
                    data.filter(a => a.appointmentStatus === 'Future' || a.appointmentStatus === 'Open'),
                    i => new Date(i.startDateTime).getTime())[0];

                if (!!appointmentTypes && appointmentTypes.some(p => p.id.toString() === upcoming.appointmentTypeId.toString() && p.reschedulable)) {
                    dispatch(setPatientUpcomingAppointment(upcoming));
                    history.replace(AppointmentFoundPath);
                }
            }
        }
    );

    useEffect(() => {
        dispatch(getProviders());
        dispatch(getLocations());
    }, [dispatch]);

    const locationOptions = useMemo(() => [
        DEFAULT_OPTION_ANY,
        ...utils.parseOptions(locations,
            item => utils.capitalizeFirstLetters(item.name),
            item => item.id.toString()
        )
    ], [DEFAULT_OPTION_ANY, locations]);

    const appointmentTypeOptions = useMemo(() => utils.parseOptions(appointmentTypes || [],
        item => item.name,
        item => item.id.toString(),
        item => item.description || ''
    ), [appointmentTypes]);

    const providerOptions = useMemo(() => [
        DEFAULT_OPTION_ANY,
        ...utils.parseOptions(providers,
            item => utils.stringJoin(' ', item.firstName, item.lastName),
            item => item.id.toString()
        )
    ], [DEFAULT_OPTION_ANY, providers]);

    if (!verifiedPatient) {
        return <div>{t('external_access.not_verified_patient')}</div>;
    }

    if (isUpcommingAppointmentLoading || appointmentTypesLoading || !appointmentTypes || !providers || providers.length === 0 || !locations || locations.length === 0) {
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
            allowMultipleDepartment: true,
            firstAvailable: timePreference === TimePreference.FirstAvailable
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
                            name='date'
                            isSmallSize={true} />
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
