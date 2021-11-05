export interface AgentPerformance {
    agent: string;
    agentAnswerRate?: number;
    agentIdleTime?: number;
    agentOnContactTime?: number;
    nonProductiveTime?: number;
    occupancy?: number;
    contactsHandled?: number;
}
