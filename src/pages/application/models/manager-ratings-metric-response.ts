import {ManagerRatingsMetric} from '@pages/application/models/manager-ratings-metric';

export interface ManagerRatingsMetricResponse {
    managerRatingsMetric: ManagerRatingsMetric[];
    overallRatingValue?: number;
}
