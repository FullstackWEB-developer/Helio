export interface QueueRealtimeStatus {
    queueName: string;
    onContact: number;
    inQueue: number;
    lwt: string;
    awt: string;
    agentsOnline: number;
    agentsAvailable: number;
    npt: number;
    acw: number;
}
