import {useCallback} from 'react';
import { useParams } from 'react-router';
import AppointmentType from './components/appointment-type/appointment-type';
import ConfigurationsMenu from './components/configurations-menu/configurations-menu';
import CancellationReasonConfig from './components/cancellation-reason-config';
import TicketDepartment from './components/ticket-department/ticket-department';

const Configurations = () => {
    const {type} = useParams<{type: string}>();
    const renderBodyByActiveRoute = useCallback(()=>{
        switch(type){
            case "cancellation-reasons":
                return <CancellationReasonConfig />
            case "ticket-department":
                return <TicketDepartment />
            case "appointment-type":
                return <AppointmentType />
            default:
                return <AppointmentType />
        }
    }, [type]);
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
