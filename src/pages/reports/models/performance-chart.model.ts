export interface PerformanceChartResponse
{
        queueName: string;
        queueData: PerformanceChart;
        botData: PerformanceChart;
}

export interface PerformanceChart
{
        queueVoice: PerformanceChartDisplayUnit[];
        queueChat: PerformanceChartDisplayUnit[];
        botVoice: PerformanceChartDisplayUnit[];
        botChat: PerformanceChartDisplayUnit[];
}

export interface PerformanceChartDisplayUnit
{
        label: string;
        value: number;
}
