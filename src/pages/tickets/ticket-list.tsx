import { useDispatch, useSelector } from 'react-redux';
import Text from "../../shared/components/text/text";
import TicketDetails from './ticket-details';
import { RootState } from '../../app/store';
import { selectTickets } from "./store/tickets.selectors";
import { useEffect } from "react";
import { getList } from "./services/tickets.api";
import { useTranslation } from 'react-i18next';
import withErrorLogging from "../../shared/HOC/with-error-logging";

const Tickets = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) => selectTickets(state));

    useEffect(() => {
        dispatch(getList())
    }, [dispatch]);

    return (
        <div className="text-secondary">
            <Text text={t('tickets.title')} type={"heading"} className={"p-2"}/>

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
