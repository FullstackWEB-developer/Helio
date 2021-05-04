import { TicketStatusType } from "../models/ticket-status";

export const statusTranslationKeyMap = {
  [TicketStatusType.Open]: "tickets.statuses.open",
  [TicketStatusType.OnHold]: "tickets.statuses.on_hold",
  [TicketStatusType.InProgress]: "tickets.statuses.in_progress",
  [TicketStatusType.Solved]: "tickets.statuses.solved",
  [TicketStatusType.Closed]: "tickets.statuses.closed",
} as const;


export const statusCssClassMap = {
  [TicketStatusType.Open]: "text-yellow-300",
  [TicketStatusType.OnHold]: "text-yellow-300",
  [TicketStatusType.InProgress]: "text-green-300",
  [TicketStatusType.Solved]: "text-gray-300",
  [TicketStatusType.Closed]: "text-gray-300"
} as const;