import { useDispatch, useSelector } from 'react-redux';
import { selectTicketById } from './store/tickets.selectors'
import { RootState } from "../../app/store";
import { setStatus } from "./services/tickets.api";
import { useTranslation } from 'react-i18next';

interface TicketItemProps {
    id: number
}

const TicketItem = ({ id }: TicketItemProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const item = useSelector((state: RootState) => selectTicketById(state, id))
    return (
        <div className="grid grid-flow-col auto-cols-max">
            <div data-test-id={"ticket-number-" + item.ticketNumber} className="p-2 w-8">{item.ticketNumber ? item.ticketNumber.toString() : ''}</div>
            <div data-test-id={"ticket-subject-" + item.ticketNumber} className="p-2 w-60">{item.subject}</div>
            <div className="p-2 w-16 text-center">{item.status ? item.status.toString() : '0'}</div>
            <div className="p-2 w-16 text-center">
                <button onClick={() => dispatch(setStatus(item.id, 3))}>{t('tickets.set')}</button>
            </div>
        </div>
    );
}

export default TicketItem;
