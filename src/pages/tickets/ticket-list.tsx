import { useDispatch, useSelector } from 'react-redux';
import Label from "../../shared/components/label/label";
import TicketDetails from './ticket-details';
import { selectTickets } from "./store/tickets.selectors";
import { useEffect } from "react";
import { getList } from "./services/tickets.service";
import { useTranslation } from 'react-i18next';
import withErrorLogging from "../../shared/HOC/with-error-logging";
import { Ticket } from './models/ticket';

const Tickets = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const items: Ticket[] = useSelector(selectTickets);

    useEffect(() => {
        dispatch(getList())
    }, [dispatch]);

    return (
        <div className="text-secondary">
            <Label text={t('tickets.title')} className={"p-2"} />

            <div className="grid grid-flow-row auto-rows-max md:auto-rows-min">
                <div className="grid grid-flow-col auto-cols-max font-bold">
                    <div className="p-2 w-8">#</div>
                    <div className="p-2 w-60">{t('tickets.subject')}</div>
                    <div className="p-2 w-16">{t('tickets.status')}</div>
                    <div className="p-2 w-16">{t('tickets.action')}</div>
                </div>
                <div>
                    {
                        items.map(item => <TicketDetails key={item.id} id={item.id} />)
                    }
                </div>
            </div>
        </div>
    );
}

export default Tickets;
export const TicketsWithErrors = withErrorLogging(Tickets);
