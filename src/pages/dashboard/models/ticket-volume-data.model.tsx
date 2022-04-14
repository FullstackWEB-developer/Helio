import {BasicStatistic} from '@pages/dashboard/models/basic-statistic.model';
import {TicketVolumeDataType} from '@pages/dashboard/models/ticket-volume-data-type.enum';

export interface TicketVolumeData {
    createdTotal: BasicStatistic[];
    closedTotal: BasicStatistic[];
    volumeDataType?: TicketVolumeDataType;
}
