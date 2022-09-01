import {AgentReport} from "../models/agent-report.model";
import {SystemReport} from "../models/system-report.model";

export const agentReportTableData: AgentReport[] = [
    {
        "timePeriod": 4,
        "reportId": "agent-monthly-20220731",
        "startDate": 20220601,
        "endDate": 20220701,
        "userId": "28680cab-766e-41dd-a986-89fc09d062ab",
        "userFullName": "Amir Lisovac",
        "totalChats": 52,
        "avgChatHandleTime": 38,
        "avgChatDuration": 35,
        "totalCalls": 12,
        "totalInbound": 12,
        "totalOutbound": 0,
        "avgVoiceHandleTime": 542,
        "avgVoiceHoldTime": 56,
        "totalCallsAndChats": 64,
        "averageIdleTime": 337295,
        "utilizationPercent": 2,
        "avgAfterContactWorkTime": 390,
        "missedContacts": 9,
        "answerRate": 59,
        "avgChatRating": 0,
        "avgVoiceRating": 0,
        "avgVoiceChatRating": 0,
        "chatRatingCount": 16,
        "voiceRatingCount": 0,
        "voiceChatRatingCount": 0,
        "totalEmailCount": 4,
        "avgEmailResponse": 0,
        "totalSmsCount": 1,
        "avgSmsResponse": 0,
        "overdueTicketCount": 0,
        "totalTicketsCount": 18
    }
];

export const systemReportData: SystemReport[] = [
    {
        "timePeriod": 3,
        "totalTickets": 88,
        "ticketCountsByReason": [
          {
            "reason": "17",
            "count": 88
          }
        ],
        "ticketRatiosByReason": [
          {
            "reason": "22",
            "count": 100
          }
        ],
        "averagePatientSatisfactionRatingForTickets": 0,
        "totalIncomingSms": 0,
        "totalOutgoingSms": 0,
        "averageSmsResponseTime": 0,
        "averagePatientSatisfactionRatingForSms": 0,
        "totalInboundChats": 0,
        "averageChatResponseTime": 17,
        "averagePatientSatisfactionRatingForChat": 0,
        "totalInboundCalls": 7,
        "averageCallResponseTime": 0,
        "totalOutboundCalls": 26,
        "averagePatientSatisfactionRatingForVoice": 0,
        "totalInboundEmails": 1,
        "averageEmailResponseTime": 0,
        "averagePatientSatisfactionRatingForEmail": 0,
        "channel": 0
      }
];