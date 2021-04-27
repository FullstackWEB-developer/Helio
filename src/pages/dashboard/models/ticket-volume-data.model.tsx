import {BasicStatistic} from './basic-statistic.model';

export interface TicketVolumeData {
    createdTotal: BasicStatistic[];
    closedTotal: BasicStatistic[];
}
