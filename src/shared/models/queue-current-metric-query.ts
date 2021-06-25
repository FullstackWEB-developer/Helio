import {MetricGrouping} from '@shared/models/metric-grouping.enum';

export interface QueueCurrentMetricQuery {
    agentUsername?: string,
    grouping? :MetricGrouping
}
