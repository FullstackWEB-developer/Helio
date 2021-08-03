import AgentState = connect.AgentState;

export interface LastAgentStatus {
    date?: Date;
    lastStatus: AgentState | undefined;
}
