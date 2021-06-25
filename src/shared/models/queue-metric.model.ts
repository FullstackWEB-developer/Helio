export interface QueueMetric {
    queueName: string;
    metric: string;
    metricId: number;
    voiceCount: number;
    chatCount: number;
    channelSummaryCount: number;
    channel: 'CHAT' | 'VOICE'
}
