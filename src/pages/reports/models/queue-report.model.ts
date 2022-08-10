import { ViewTypes } from "./view-types.enum"

export interface QueueReport {
        timePeriod: ViewTypes,
        reportId: string,
        queueName: string,
        startDate: number,
        endDate: number,
        hour: number,
        totalInboundCalls: number,
        totalInboundCallsAnswered: number,
        answeredCallsPercent: number,
        totalInboundCallsAbandoned: number,
        abandonedCallsPercent: number,
        averageCallLength: number,
        averageInboundCallWaitTime: number,
        totalNumberOfIncomingChats: number,
        totalNumberOfServicedChats: number,
        servicedChatsPercent: number,
        totalIncomingChatAbandoned: number,
        abandonedChatsPercent: number,
        averageChatLength: number,
        averageIncomingChatWaitTime: number,
}