import {useSelector} from "react-redux";
import {Appointment} from "../../external-access/appointment/models/appointment";
import {selectDepartmentById, selectProviderById} from "../../../shared/store/lookups/lookups.selectors";
import {RootState} from "../../../app/store";
import utils from "../../../shared/utils/utils";
interface AppointmentProps {
    appointment: Appointment,
    border?: boolean
}

const AppointmentDisplay = ({appointment, border}: AppointmentProps) => {
    const department = useSelector((state: RootState) => selectDepartmentById(state, appointment.departmentId));
    const provider = useSelector((state: RootState) => selectProviderById(state, appointment.providerId));

    return (
            <div className={"pt-3"}>
                <span>{utils.formatDate(appointment.date)} <span
                    className="font-bold">{appointment.patientAppointmentTypeName}</span></span>
                <div className={`pb-3 ${border ? 'border-b' : '' }`}>{provider?.displayName} {department?.patientDepartmentName}</div>
            </div>
    );
};

export default AppointmentDisplay;
