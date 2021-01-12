import { useSelector } from 'react-redux';
import { selectTicketById } from './store/tickets.selectors'
import FieldDisplay from "../../shared/components/field-display/field-display";
import { RootState } from "../../app/store";

interface Props {
    id: number
}
const TicketItem = ({ id }: Props) => {
    const item = useSelector((state: RootState) => selectTicketById(state, id))
    return (
        <div className="flex flex-row">
            <div >
                <FieldDisplay label='Id' value={item.id.toString()} labelType={"label"} />
            </div>
            <div >
                <FieldDisplay label='Comment' value={item.comment} labelType={"label"} />
            </div>
            <div >
                <FieldDisplay label='Status' value={item.status} labelType={"label"} />
            </div>
            <hr />
        </div>
    );
}

export default TicketItem;