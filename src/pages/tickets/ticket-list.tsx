import React from 'react';
import { useSelector } from 'react-redux';
import Text from "../../shared/components/text/text";
import TicketDetails from './ticket-details';
import { RootState } from '../../app/store';
import { selectTickets} from "./store/tickets.selectors";

const Tickets = () => {
    const items = useSelector((state: RootState) => selectTickets(state))
    return (
        <div className={`tickets`}>
            <Text text={"All tickets"} type={"heading"}/>
            <div className={`ticket-list`}>
                {
                    items.map(item => <TicketDetails key={item.id} id={ item.id } />)
                }
            </div>
        </div>
    );
}

export default Tickets;