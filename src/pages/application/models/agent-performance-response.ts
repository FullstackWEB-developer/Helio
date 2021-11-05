import {TicketPerformance} from '@pages/application/models/ticket-performance';

export interface AgentPerformanceResponse {
    dailyPerformance: TicketPerformance[];
    totalReceived: number;
    totalClosed: number;
    resolutionRate?: number;
}
