import {Option} from '@components/option/option';

export interface TicketUpdateModel {
    status?: Option;
    priority?: Option;
    type?: Option;
    reason?: Option;
    department?: Option;
    location?: Option;
    tags: string[];
}
