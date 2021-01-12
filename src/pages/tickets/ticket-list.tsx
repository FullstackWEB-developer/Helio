import { useSelector } from 'react-redux';
import Text from "../../shared/components/text/text";
import TicketDetails from './ticket-details';
import { RootState } from '../../app/store';
import { selectTickets } from "./store/tickets.selectors";

const Tickets = () => {
    const items = useSelector((state: RootState) => selectTickets(state))
    return (
        <div >
            <Text text={"All tickets"} type={"heading"} />
            <div>
                {
                    items.map(item => <TicketDetails key={item.id} id={item.id} />)
                }
            </div>
        </div>
    );
}

export default Tickets;