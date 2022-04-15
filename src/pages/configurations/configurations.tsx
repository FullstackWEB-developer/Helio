import {useCallback} from 'react';
import { useParams } from 'react-router';
import CancellationReasonConfig from './components/cancellation-reason-config';
import ConfigurationsMenu from './components/configurations-menu';
import TicketDepartment from './components/ticket-department/ticket-department';

const Configurations = () => {
    const {type} = useParams<{type: string}>();
    const renderBodyByActiveRoute = useCallback(()=>{
        switch(type){
            case "cancellation-reasons":
                return <CancellationReasonConfig />
            case "ticket-department":
                return <TicketDepartment />
            default:
                return <div>{type}</div>
        }
    }, [type]);
    return (
        <div className="flex w-full h-full overflow-y-auto">
            <ConfigurationsMenu activeUrl={type}></ConfigurationsMenu>
            {
                renderBodyByActiveRoute()
            }
        </div>
    );
}

export default Configurations;
