import {useQuery} from 'react-query';
import {GetCallbackTicketCount} from '@constants/react-query-constants';
import {getCallbackTicketCount} from '@pages/tickets/services/tickets.service';
import {useDispatch, useSelector} from 'react-redux';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import {CallbackTicketCountType} from '@pages/tickets/models/callback-ticket-count-type.enum';
import {
    setMyCallbackTicketCount,
    setTeamCallbackTicketCount, setTicketFilter,
    setTicketListQueryType
} from '@pages/tickets/store/tickets.slice';
import SvgIcon, {Icon} from '@components/svg-icon';
import {BadgeNumber} from '@icons/BadgeNumber';
import {selectMyCallbackTicketCount, selectTeamCallbackTicketCount} from '@pages/tickets/store/tickets.selectors';
import {useHistory} from 'react-router-dom';
import {TicketType} from '@shared/models';
import {selectAppUserDetails} from '@shared/store/app-user/appuser.selectors';
import {TicketStatuses} from '@pages/tickets/models/ticket.status.enum';
import {TicketListQueryType} from '@pages/tickets/models/ticket-list-type';
import {TicketQuery} from '@pages/tickets/models/ticket-query';

const CallbackTicketCount = () => {
    const hasTeamView = useCheckPermission('Tickets.DefaultToTeamView');
    const dispatch = useDispatch();
    const myCallbackTicketCount = useSelector(selectMyCallbackTicketCount);
    const teamCallbackTicketCount = useSelector(selectTeamCallbackTicketCount);
    const appUser = useSelector(selectAppUserDetails);
    const history = useHistory();

    useQuery([GetCallbackTicketCount, CallbackTicketCountType.Team], () => getCallbackTicketCount(CallbackTicketCountType.Team), {
        onSuccess: (data) => {
            dispatch(setTeamCallbackTicketCount(data))
        }
    });

    useQuery([GetCallbackTicketCount, CallbackTicketCountType.My], () => getCallbackTicketCount(CallbackTicketCountType.My), {
        onSuccess: (data) => {
            dispatch(setMyCallbackTicketCount(data))
        }
    });

    const gotoTickets = () => {
        const assignedTo = hasTeamView ? 'null' : appUser.id;
        if (hasTeamView) {
            dispatch(setTicketListQueryType(TicketListQueryType.AllTicket));
        } else {
            dispatch(setTicketListQueryType(TicketListQueryType.MyTicket));
        }
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

    return <div className='flex flex-row pr-14 cursor-pointer' onClick={() => gotoTickets()}>
        <SvgIcon className='icon-medium-18' fillClass='rgba-062-fill' type={Icon.CallbackTicketCount} />
        <BadgeNumber type='red' number={hasTeamView ? teamCallbackTicketCount : myCallbackTicketCount} />
    </div>
}

export default CallbackTicketCount;
