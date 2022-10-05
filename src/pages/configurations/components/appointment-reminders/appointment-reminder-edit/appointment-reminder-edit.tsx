import { useTranslation } from "react-i18next";
import { Option } from '@components/option/option';
import { Control } from "react-hook-form";
import SvgIcon, { Icon } from "@components/svg-icon";
import { ControlledSelect } from "@components/controllers";

const AppointmentReminderEdit = ({ index,
    selectedDay,
    control,
    availableDays,
    onSelect,
    onRemove
}: {
    index: number,
    selectedDay?: string,
    control: Control,
    availableDays: Option[],
    onSelect(value: string),
    onRemove(index: number)
}) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-row body2 items-center">
            <span> {t('configuration.appointment_reminders.days_dropdown_label_prefix')} </span>
            <div className="w-48 mx-6 pt-4">
                <ControlledSelect
                    name={`appointmentReminders.${index}.selectedDay`}
                    label='configuration.appointment_reminders.days_dropdown_label'
                    options={availableDays}
                    control={control}
                    required={true}
                    defaultValue={selectedDay}
                    onSelect={(option: Option | undefined) => {
                        if (option) onSelect(option?.value)
                    }}
                />
            </div>

            <span className="mr-8"> {t('configuration.appointment_reminders.days_dropdown_label_sufix')} </span>
            <SvgIcon dataTestId={`${index}-close-icon`} type={Icon.Close} className={`icon-medium-18 rgba-038-fill cursor-pointer`} onClick={() => onRemove(index)} />
        </div>
    )
}
export default AppointmentReminderEdit;
