import {useDispatch, useSelector} from 'react-redux';
import {
    selectMyCallbackTicketCount,
    selectTeamCallbackTicketCount,
    selectTicketQueryType
} from '@pages/tickets/store/tickets.selectors';
import {TicketType} from '@shared/models';
import {TicketStatuses} from '@pages/tickets/models/ticket.status.enum';
import {useHistory} from 'react-router-dom';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import {TicketListQueryType} from '@pages/tickets/models/ticket-list-type';
import {BadgeNumber} from '@icons/BadgeNumber';
import {useTranslation} from 'react-i18next';
import {TicketQuery} from '@pages/tickets/models/ticket-query';
import {setTicketFilter} from '@pages/tickets/store/tickets.slice';

const TicketFilterCallbackCount = () => {

    const myCallbackTicketCount = useSelector(selectMyCallbackTicketCount);
    const teamCallbackTicketCount = useSelector(selectTeamCallbackTicketCount);
    const history = useHistory();
    const {t} = useTranslation();
    const appUser = useSelector(selectAppUserDetails);
    const dispatch = useDispatch();
    const ticketListQueryType = useSelector(selectTicketQueryType);

    const gotoTickets = () => {
        const assignedTo = ticketListQueryType === TicketListQueryType.AllTicket ? 'null' : appUser.id;
        const query: TicketQuery = {
            assignedTo: [assignedTo],
            statuses: [TicketStatuses.Open, TicketStatuses.OnHold, TicketStatuses.InProgress],
            ticketTypes: [TicketType.Callback],
            page: 1,
            pageSize: 25,
            totalCount: 0,
            totalPages: 1
        };
        dispatch(setTicketFilter(query));
        history.push({
            pathname: 'tickets',
            search: `ticketTypes=${TicketType.Callback}&assignedTo=${assignedTo}&statuses=${TicketStatuses.Open}&statuses=${TicketStatuses.OnHold}&statuses=${TicketStatuses.InProgress}`,
            state: {
                callbackRefresh: true,
                assignedTo
            }
        });
    }

    return <div className='flex flex-row pr-14 items-center h-10 mb-4'>
        <div className='subtitle pr-3 cursor-pointer' onClick={() => gotoTickets()}>{t('tickets.filter.callbacks')}</div>
        <div className='cursor-pointer' onClick={() => gotoTickets()}>
            <BadgeNumber type='red' number={ticketListQueryType === TicketListQueryType.AllTicket ? teamCallbackTicketCount : myCallbackTicketCount} />
        </div>
    </div>
}

export default TicketFilterCallbackCount;

