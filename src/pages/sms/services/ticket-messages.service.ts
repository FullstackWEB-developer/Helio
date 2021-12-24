import {ChannelTypes, PagedList, TicketMessageSummary, TicketMessage, TicketMessageSummaryRequest, PagedRequest, TicketMessageBase} from "@shared/models";
import Api from "@shared/services/api";
import {CreateTicketMessageRequest} from '@pages/sms/models/create-ticket-message-request.model';

const ticketMessageUrl = '/tickets/messages';

export const getMessages = async (ticketId: string, channel: ChannelTypes, pagedRequest: PagedRequest) : Promise<PagedList<TicketMessage>> => {
    const url = `${ticketMessageUrl}/${ticketId}/${channel}`;
    const response = await Api.get<PagedList<TicketMessage>>(url, {params: pagedRequest});
    return response.data;
}

export const getMessage = async (id: string) => {
    const url = `${ticketMessageUrl}/${id}`;
    const response = await Api.get<TicketMessage>(url);
    return response.data;
}

export const getChats = async (request: TicketMessageSummaryRequest) => {
    const url = `${ticketMessageUrl}/search`;
    const response = await Api.get<PagedList<TicketMessageSummary>>(url, {params: request});
    return response.data;
}

export const sendMessage = async (message: TicketMessageBase) => {
    const response = await Api.post<TicketMessage>(ticketMessageUrl, message);
    return response.data;
}

export const createTicketMessage = async (request: CreateTicketMessageRequest) => {
    const response = await Api.post<TicketMessage>(ticketMessageUrl, request);
    return response.data;
}

export const markRead = async (ticketId: string, channel: ChannelTypes) => {
    const url = `${ticketMessageUrl}/${ticketId}/${channel}/read`;
    await Api.put(url);
    return {ticketId, channel};
}
