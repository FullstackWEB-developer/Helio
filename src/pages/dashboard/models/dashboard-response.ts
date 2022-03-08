import {TicketStatusStats} from '@pages/dashboard/models/ticket-status-stats.model';
import {BasicStatistic} from '@pages/dashboard/models/basic-statistic.model';
import {RatingStats} from '@pages/dashboard/models/ratings.model';
import {TicketVolumeData} from '@pages/dashboard/models/ticket-volume-data.model';
import {HandleAndResponseTimes} from '@pages/dashboard/models/handle-and-response-time.model';
import {PatientRatings} from '@pages/dashboard/models/patient-ratings.model';

export interface DashboardResponse {
    statusStats: TicketStatusStats;
    channels: BasicStatistic[];
    reasons: BasicStatistic[];
    priorities: BasicStatistic[];
    volumes: TicketVolumeData;
    ratingStats: RatingStats;
    patientRatings: PatientRatings;
    times: HandleAndResponseTimes;
}
