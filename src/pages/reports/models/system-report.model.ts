import {ReasonStatistic} from '@pages/reports/models/reason-statistic.model';
import {ViewTypes} from '@pages/reports/models/view-types.enum';

export interface SystemReport {
    averageCallResponseTime: number;
    averageChatResponseTime: number;
    averageEmailResponseTime: number;
    averagePatientSatisfactionRatingForChat: number;
    averagePatientSatisfactionRatingForEmail: number;
    averagePatientSatisfactionRatingForSms: number;
    averagePatientSatisfactionRatingForTickets: number;
    averagePatientSatisfactionRatingForVoice: number;
    averageSmsResponseTime: number;
    channel: number;
    ticketCountsByReason: ReasonStatistic[];
    ticketRatiosByReason: ReasonStatistic[];
    timePeriod: ViewTypes;
    totalInboundCalls: number;
    totalInboundChats: number;
    totalInboundEmails: number;
    totalIncomingSms: number;
    totalOutboundCalls: number;
    totalOutgoingSms: number;
    totalTickets: number;
}
