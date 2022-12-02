import {
  ChannelTypes,
  PagedList,
  TicketMessageSummary,
  TicketMessage,
  TicketMessageSummaryRequest,
  PagedRequest,
  TicketMessageBase,
  EmailMessageDto,
  TicketMessagesDirection,
} from '@shared/models';
import Api from '@shared/services/api';
import { CreateTicketMessageRequest } from '@pages/sms/models/create-ticket-message-request.model';
import utils from '@shared/utils/utils';
import { MimeTypes } from '@shared/models/mime-types.enum';
import { Ticket } from '@pages/tickets/models/ticket';

const ticketMessageUrl = '/tickets/messages';

export const getMessages = async (
  ticketId: string,
  channel: ChannelTypes,
  pagedRequest: PagedRequest,
): Promise<PagedList<TicketMessage | EmailMessageDto>> => {
  const url = `${ticketMessageUrl}/${ticketId}/${channel}`;
  const response = await Api.get<PagedList<TicketMessage | EmailMessageDto>>(
    url,
    { params: pagedRequest },
  );
  return response.data;
};

export const getMessage = async (id: string) => {
  const url = `${ticketMessageUrl}/${id}`;
  const response = await Api.get<TicketMessage>(url);
  return response.data;
};

export const getChats = async (request: TicketMessageSummaryRequest) => {
  const url = `${ticketMessageUrl}/search`;
  const response = await Api.get<PagedList<TicketMessageSummary>>(url, {
    params: request,
  });
  return response.data;
};

export const sendMessage = async (message: TicketMessageBase) => {
  if (message.channel === ChannelTypes.Email) {
    message.body = message.body.replaceAll('\n', '<br/>');
  }
  const response = await Api.post<TicketMessage>(ticketMessageUrl, message);
  return response.data;
};

export const createTicketMessage = async (
  request: CreateTicketMessageRequest,
) => {
  const response = await Api.post<TicketMessage>(ticketMessageUrl, request);
  return response.data;
};

export const markRead = async (
  ticketId: string,
  channel: ChannelTypes,
  direction: TicketMessagesDirection,
  id?: string,
) => {
  const url = `${ticketMessageUrl}/read`;
  await Api.put(url, null, {
    params: {
      ticketId,
      channel,
      direction,
      id,
    },
  });
  return { ticketId, channel };
};

export const splitTicket = async (messageId: string): Promise<Ticket> => {
  const url = `${ticketMessageUrl}/split/${messageId}`;
  const response = await Api.get(url);
  return response.data;
};

export const downloadAttachments = async ({
  messageId,
  contentId,
  mimeTypeToDownloadIn = 'application/zip',
}: {
  messageId: string;
  contentId?: string;
  mimeTypeToDownloadIn?: MimeTypes | string;
}) => {
  const url = `${ticketMessageUrl}/download-attachments/${messageId}${
    contentId ? `/${contentId}` : ''
  }`;
  const response = await Api.get(url, {
    responseType: 'arraybuffer',
  });
  utils.downloadFileFromData(
    response.data,
    contentId ?? `attachments-${messageId}`,
    mimeTypeToDownloadIn,
  );
  return response.data;
};
