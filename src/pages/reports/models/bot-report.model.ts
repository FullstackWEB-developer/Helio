import {TicketRate} from './ticket-rate.enum';

export interface BotReport {
    totalCalls: number;
    totalChats: number;
    averageVoiceDuration: number;
    averageChatDuration: number;
    voiceRating: TicketRate;
    chatRating: TicketRate;
    appointmentsScheduled: number;
    appointmentsRescheduled: number;
    appointmentsCanceled: number;
    appointmentsInformationRequests: number;
    medicationRefillRequests: number;
    testResultsRequests: number;
    medicalHistoryRequests: number;
    patientsRegistered: number;
}
