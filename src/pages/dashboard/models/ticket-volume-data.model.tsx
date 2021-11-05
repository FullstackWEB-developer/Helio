import {BasicStatistic} from '@pages/dashboard/models/basic-statistic.model';

export interface TicketVolumeData {
    createdTotal: BasicStatistic[];
    closedTotal: BasicStatistic[];
}
