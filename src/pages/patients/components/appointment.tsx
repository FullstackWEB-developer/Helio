import {useSelector} from "react-redux";
import {Appointment} from "../../external-access/appointment/models/appointment";
import {selectDepartmentById, selectProviderById} from "../../../shared/store/lookups/lookups.selectors";
import {RootState} from "../../../app/store";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
interface AppointmentProps {
    appointment: Appointment,
    border?: boolean
}

const AppointmentDisplay = ({appointment, border}: AppointmentProps) => {
    const department = useSelector((state: RootState) => selectDepartmentById(state, appointment.departmentId));
    const provider = useSelector((state: RootState) => selectProviderById(state, appointment.providerId));
    const dateStr = `${dayjs(appointment.date).format("MMM, DD, YYYY")} at ${dayjs(appointment.startTime, "HH:mm").format("h:mm A")} `;

    return (
            <div className={"pt-3"}>
                <span>{dateStr}<span
                    className="font-bold">{appointment.patientAppointmentTypeName} </span></span>
                <div className={`pb-3 ${border ? 'border-b' : '' }`}>{provider?.displayName} {department?.patientDepartmentName} {department?.phone}</div>
            </div>
    );
};

export default AppointmentDisplay;
