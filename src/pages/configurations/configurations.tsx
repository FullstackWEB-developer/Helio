import { useCallback } from 'react';
import { useParams } from 'react-router';
import AppointmentType from './components/appointment-type/appointment-type';
import ConfigurationsMenu from './components/configurations-menu/configurations-menu';
import CancellationReasonConfig from './components/cancellation-reason/cancellation-reason-config';
import TicketDepartment from './components/ticket-department/ticket-department';
import EditCancellationReason from './components/cancellation-reason/edit-cancellation-reason/edit-cancellation-reason';
interface CancellationReasonParams {
    type: string,
    id: string
}
const Configurations = () => {
    const { type, id } = useParams<CancellationReasonParams>();
    const renderBodyByActiveRoute = useCallback(() => {
        switch (type) {
            case "cancellation-reasons":
                if (id) { return <EditCancellationReason /> }
                else { return <CancellationReasonConfig /> }
            case "ticket-department":
                return <TicketDepartment />
            case "appointment-type":
                return <AppointmentType />
            default:
                return <AppointmentType />
        }
    }, [type, id]);
    return (
        <div className="flex w-full h-full overflow-y-auto">
            <ConfigurationsMenu activeUrl={type ? type : 'appointment-type'}></ConfigurationsMenu>
            {
                renderBodyByActiveRoute()
            }
        </div>
    );
}

export default Configurations;
