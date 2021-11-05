import {AgentPerformanceByChannel} from './agent-performance-by-channel';
import {AgentContactHandlesByChannel} from './agent-contact-handles-by-channel';
import {AgentPerformance} from './agent-performance';


export interface AgentContactPerformanceResponse {
    agentPerformanceByChannel: AgentPerformanceByChannel[];
    agentContactHandlesByChannel: AgentContactHandlesByChannel[];
    agentPerformance: AgentPerformance[];
}
