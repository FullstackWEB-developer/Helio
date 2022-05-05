import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Ticket} from "../models/ticket";
import initialTicketState from "./tickets.initial-state";
import {LookupValue} from "../models/lookup-value";
import {DefaultPagination, Paging} from "@shared/models/paging.model";
import {TicketEnum} from "../models/ticket-enum.model";
import {TicketQuery} from "../models/ticket-query";
import {TicketListQueryType} from "../models/ticket-list-type";
import {TicketUpdateModel} from '@pages/tickets/models/ticket-update.model';

const ticketsSlice = createSlice({
  name: "tickets",
  initialState: initialTicketState,
  reducers: {
    add(state, {payload}: PayloadAction<Ticket[]>) {
      state.tickets = payload;
    },
    addPaging(state, {payload}: PayloadAction<Paging>) {
      state.paging = payload;
    },
    changeStatus(state, {payload}: PayloadAction<Ticket>) {
      const ticket = state.tickets.find((t) => t.id === payload.id);
      if (ticket) {
        ticket.status = payload.status;
      }
    },
    setTicketUpdateModel(state, {payload}: PayloadAction<TicketUpdateModel>) {
      state.ticketUpdate = payload
    },
    setTicketUpdateHash(state, {payload}: PayloadAction<string>){
      state.ticketUpdateHash = payload
    },
    changeAssignee(state, {payload}: PayloadAction<{ ticketId: string, assigneeId: string }>) {
      const ticket = state.tickets.find((t) => t.id === payload.ticketId);
      if (ticket) {
        ticket.assignee = payload.assigneeId;
      }
    },
    changeTicket(state, {payload}: PayloadAction<Ticket>) {
      const {id, subject, status} = payload;
      let ticket = state.tickets.find((t) => t.id === id);
      if (ticket) {
        ticket.subject = subject;
        ticket.status = status;
      }
    },
    setTicket(state, {payload}: PayloadAction<Ticket>) {
      state.selectedTicket = payload;

    },
    setFailure: (state, {payload}: PayloadAction<string>) => {
      state.errors = payload;
    },
    setTicketsFiltered: (state, {payload}: PayloadAction<boolean>) => {
      state.isTicketsFiltered = payload;
    },
    setFeedLastMessageOn(state, {payload}: PayloadAction<Date | undefined>) {
      state.feedLastMessageOn = payload;
    },
    setTicketEnum(state, {payload}: PayloadAction<any>) {
      state.error = "";
      state.isTicketEnumValuesLoading = false;
      const enumValue: TicketEnum = {
        key: payload.key,
        value: payload.result,
      };
          if (!state.enumValues) {
        state.enumValues = [];
      }
      state.enumValues.push(enumValue);
    },
    startGetTicketEnumRequest(state) {
      state.error = "";
      state.isTicketEnumValuesLoading = true;
    },
    endGetTicketEnumRequest(state, { payload }: PayloadAction<string>) {
      state.error = payload;
      state.isTicketEnumValuesLoading = false;
    },
    setLookupValues(state, { payload }: PayloadAction<any>) {
      state.error = "";
      state.isLookupValuesLoading = false;
      const lookupValue: LookupValue = {
        key: payload.key,
        value: payload.result,
      };
      if (!state.lookupValues) {
        state.lookupValues = [];
      }
      state.lookupValues = state.lookupValues.filter((a) => a.key !== payload.key);
      state.lookupValues.push(lookupValue);
    },
    startGeLookupValuesRequest(state) {
      state.error = "";
      state.isLookupValuesLoading = true;
    },
    endGetLookupValuesRequest(state, { payload }: PayloadAction<string>) {
      state.error = payload;
      state.isLookupValuesLoading = false;
    },
    toggleTicketListFilter(state, { payload }: PayloadAction<boolean | undefined>) {
      if (payload === undefined) {
        state.isFilterOpen = !state.isFilterOpen;
      } else {
        state.isFilterOpen = payload;
      }

    },
    setSearchTerm(state, { payload }: PayloadAction<string>) {
      state.searchTerm = payload;
    },
    setTicketFilter(state, { payload }: PayloadAction<TicketQuery>) {
      state.ticketFilter = payload;
    },
    clearTicketFilters(state){
      state.ticketFilter = {
        ...DefaultPagination
      }
    },
    toggleChatTranscriptWindowVisible(state) {
      state.isChatTranscriptModalVisible = !state.isChatTranscriptModalVisible;
    },
    toggleCallLogPlayerVisible(state) {
      state.isCallLogPlayerVisible = !state.isCallLogPlayerVisible;
    },
    setTicketListQueryType(
      state,
      { payload }: PayloadAction<TicketListQueryType>
    ) {
        state.ticketListQueryType = payload;
    },
    setPatientPhoto(state, { payload }: PayloadAction<string>) {
      state.patientPhoto = payload;
    },
    setUnreadTicket(state, {payload}: PayloadAction<number>) {
      state.unreadTickets = payload;
    },
    setUnreadTeamTicket(state, {payload}: PayloadAction<number>) {
      state.unreadTeamTickets = payload;
    }
  },
});

export const {
  add,
  addPaging,
  changeStatus,
  changeTicket,
  changeAssignee,
  setTicket,
  setFailure,
  setFeedLastMessageOn,
  setTicketEnum,
  startGetTicketEnumRequest,
  endGetTicketEnumRequest,
  setLookupValues,
  startGeLookupValuesRequest,
  endGetLookupValuesRequest,
  toggleTicketListFilter,
  setSearchTerm,
  setTicketFilter,
  setTicketListQueryType,
  setTicketUpdateModel,
  setTicketUpdateHash,
  toggleChatTranscriptWindowVisible,
  toggleCallLogPlayerVisible,
  clearTicketFilters,
  setTicketsFiltered,
  setPatientPhoto,
  setUnreadTicket,
  setUnreadTeamTicket
} = ticketsSlice.actions;

export default ticketsSlice.reducer;
