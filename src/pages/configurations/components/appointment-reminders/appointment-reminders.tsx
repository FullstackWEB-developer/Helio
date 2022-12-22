import Button from "@components/button/button";
import { Option } from "@components/option/option";
import RouteLeavingGuard from "@components/route-leaving-guard/route-leaving-guard";
import { SnackbarType } from "@components/snackbar/snackbar-type.enum";
import Spinner from "@components/spinner/Spinner";
import SvgIcon, { Icon } from "@components/svg-icon";
import { GetAppointmentReminders } from "@constants/react-query-constants";
import { getAppointmentReminders, setAppointmentReminders } from "@shared/services/lookups.service";
import { addSnackbarMessage } from "@shared/store/snackbar/snackbar.slice";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import AppointmentReminderEdit from "./appointment-reminder-edit/appointment-reminder-edit";
interface AppointmentReminderControl {
    selectedDay: string
}
interface AppointmentRemindersForm {
    appointmentReminders: AppointmentReminderControl[]
}
const AppointmentReminders = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const NoRemindersString = "-";
    const availableDaysInitialState = Array(14).fill(0).map<Option>((_, i: number) => {
        return { value: (i + 1).toString(), label: (i + 1).toString() }
    });
    const [availableDays, setAvailableDays] = useState<Option[]>(availableDaysInitialState);
    const [editMode, setEditMode] = useState<boolean>(false);
    const setAppointmentRemindersMutation = useMutation(setAppointmentReminders, {
        onSuccess: () => {
            refetch();
            dispatch(addSnackbarMessage({
                type: SnackbarType.Success,
                message: 'configuration.appointment_reminders.set_success'
            }));
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'configuration.appointment_reminders.set_error'
            }));
        }
    });
    const {
        handleSubmit,
        control,
        formState,
        getValues,
        setValue
    } = useForm<AppointmentRemindersForm>({ mode: 'onChange' });
    const { fields, append, remove } = useFieldArray<AppointmentReminderControl>({ name: 'appointmentReminders', control });
    const { isFetching, refetch } = useQuery<string>(GetAppointmentReminders, () => getAppointmentReminders(), {
        onSuccess: (data) => {
            setAvailableDays(availableDaysInitialState);
            if (data) {
                let days: string[] = [];
                if (data) {
                    if (data.toString().indexOf("|") > -1) {
                        days = data.split('|');
                    } else {
                        if (data.toString() !== NoRemindersString) {
                            days.push(data.toString());
                        }
                    }
                }
                setEditMode(days.length > 0)
                const availableDaysCopy = [...availableDays];
                setValue('appointmentReminders', days.map(day => {
                    return { selectedDay: day }
                }))
                setTimeout(function () { setAvailableDays(availableDaysCopy.filter(x => !days.includes(x.value))); }, 1);
            }
        },
        onError: () => {
            dispatch(addSnackbarMessage({
                message: 'configuration.appointment_reminders.get_error',
                type: SnackbarType.Error
            }))
        }
    });
    const onSelect = (selectedDay: string, index: number) => {
        const availableDaysInitialStateCopy = [...availableDaysInitialState];
        const takenDays = getValues().appointmentReminders.map((item, i) => {
            if (i === index) {
                return selectedDay;
            } else {
                return item.selectedDay;
            }
        });
        setAvailableDays(availableDaysInitialStateCopy.filter(d => !takenDays.includes(d.value)));
    }
    const addAnotherReminder = () => {
        append({ selectedDay: '' })
    }
    const removeReminder = (index: number) => {
        const availableDaysInitialStateCopy = [...availableDaysInitialState];
        const takenDays = [...getValues().appointmentReminders].filter((_, i) => i !== index).map(x => x.selectedDay);
        setAvailableDays(availableDaysInitialStateCopy.filter(d => !takenDays.includes(d.value)));
        remove(index);
    }

    const onSubmit = (formData: AppointmentRemindersForm) => {
        let payload = NoRemindersString;
        if (formData.appointmentReminders) {
            payload = formData.appointmentReminders.map(x => parseInt(x.selectedDay)).sort((a,b) => a-b).join('|');
        }
        setAppointmentRemindersMutation.mutate(payload);
    }

    const onCancel = () => {
        refetch();
        setAvailableDays(availableDaysInitialState);
    }

    const renderInterface = () => {
        return (
            editMode ?
                <form onSubmit={handleSubmit(onSubmit)}>
                    < p className='body2 mb-6' > {t('configuration.appointment_reminders.reminders_description')}</p >
                    {fields?.map((form, index: number) => {
                        return <AppointmentReminderEdit
                            key={form.id}
                            control={control}
                            index={index}
                            selectedDay={form.selectedDay}
                            availableDays={availableDays}
                            onSelect={(newValue) => { onSelect(newValue, index) }}
                            onRemove={removeReminder}
                        ></AppointmentReminderEdit>
                    })}
                    <div className="flex flex-row items-center mb-10">
                        <div className="flex cursor-pointer" onClick={() => addAnotherReminder()}>
                            <SvgIcon type={Icon.Add} className={`icon-medium-18 rgba-038-fill`} />
                            <span className="body2-primary  ml-4 py-auto"> {t('configuration.appointment_reminders.add_another_reminder_button')}</span>
                        </div>
                    </div>
                    <div className='flex'>
                        <Button
                            type='submit'
                            buttonType='medium'
                            disabled={!formState.isValid || !formState.isDirty}
                            label='common.save'
                            isLoading={isFetching || setAppointmentRemindersMutation.isLoading}
                        />
                        <Button label='common.cancel' className=' ml-8 mr-8' buttonType='secondary' onClick={() => onCancel()} disabled={isFetching || setAppointmentRemindersMutation.isLoading} />
                        <RouteLeavingGuard
                            when={formState.isDirty && !formState.isSubmitSuccessful}
                            navigate={path => history.push(path)}
                            title={'configuration.appointment_reminders.warning_info_leaving'}
                        />
                    </div>
                </form >
                :
                <>
                    <p className='body2'>{t('configuration.appointment_reminders.non_reminders_description_1')}</p>
                    <p className='body2'>{t('configuration.appointment_reminders.non_reminders_description_2')}</p>
                    <Button label='configuration.appointment_reminders.add_reminder_button' className=' ml-6 mt-6' buttonType='medium' onClick={() => {
                        setEditMode(true);
                        addAnotherReminder();
                    }} />
                </>
        )
    }
    return (
        <div className='w-10/12 overflow-auto h-full p-6 pr-4'>
            <h5 className='pb-6'>{t('configuration.appointment_reminders.title')}</h5>
            {isFetching ? <Spinner /> :
                renderInterface()
            }
        </div>
    )
}
export default AppointmentReminders;
