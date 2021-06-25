export interface PerformanceMetric {
    channel: string;
    total: number;
    inbound: number;
    outbound: number;
    callbacks: number;
    handledTime: string;
    answered: number;
    missed: number;
    abandoned : number;
    answerTime: string;
    holdTime: string;
}
