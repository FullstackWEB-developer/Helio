import {TicketStatuses} from "../models/ticket.status.enum";

export const statusTranslationKeyMap = {
  [TicketStatuses.Open]: "tickets.statuses.1",
  [TicketStatuses.OnHold]: "tickets.statuses.2",
  [TicketStatuses.InProgress]: "tickets.statuses.3",
  [TicketStatuses.Solved]: "tickets.statuses.4",
  [TicketStatuses.Closed]: "tickets.statuses.5",
} as const;

export const statusCssClassMap = {
  [TicketStatuses.Open]: "text-yellow-300",
  [TicketStatuses.OnHold]: "text-yellow-300",
  [TicketStatuses.InProgress]: "text-green-300",
  [TicketStatuses.Solved]: "text-gray-300",
  [TicketStatuses.Closed]: "text-gray-300",
  9: "text-red-400"
} as const;