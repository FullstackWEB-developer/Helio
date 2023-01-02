export interface ConnectEventRecord {
    userEmail: string;
    numberOfHolds: number;
    belongsToTicket: number;
    afterContactWorkStartTimestamp?: Date;
    agentInteractionDuration: number;
    connectedToAgentTimestamp?: Date;
    customerHoldDuration: number;
    longestHoldDuration: number;
    contactId: string;
    nextContactId: string;
    previousContactId: string;
    initialContactId: string;
    queueName: string;
    transferCompletedTimestamp?: Date;
    enqueueTimestamp?: Date;
    dequeueTimestamp?: Date;
    initiationTimestamp?: Date;
    disconnectTimestamp?: Date;
    queueDuration: number;
    initiationMethod: string;
    disconnectReason: string;
    recordingLocation: string;
}
