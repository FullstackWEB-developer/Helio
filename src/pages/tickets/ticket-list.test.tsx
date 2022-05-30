import i18n from '../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import React from 'react'
import TestWrapper from '@shared/test-utils/test-wrapper';
import TicketList from '@pages/tickets/ticket-list';
import {Paging, User, UserDetail} from '@shared/models';
import initialAppUserState from '@shared/store/app-user/appuser.initial-state';
import {TicketQuery} from '@pages/tickets/models/ticket-query';
import {Ticket} from '@pages/tickets/models/ticket';

fdescribe("Ticket List tests", () => {
    let container: HTMLDivElement | null;
    let mockState = {
        layoutState: {
            lastNavigationDate: dayjs('2022-12-12').toDate()
        },
        ticketState: {
            paging: {
                page: 1
            } as Paging,
            ticketFilter: {
                page: 1
            } as TicketQuery,
            tickets: [{
                id:'123',
                createdOn: dayjs('2022-10-10').toDate()
            }] as Ticket[]
        },
        appUserState: {
            ...initialAppUserState,
            appUserDetails: {
                id: '123213'
            } as UserDetail
        },
        lookupsState: {
            userList: [ {
                lastName: 'test',
                firstName:'last',
                id:'123',
                email:'asdasd@asdas.com',
                latestConnectStatus: 'Available',
                profilePicture: 'test'
            }] as User[]
        }
    };

    beforeEach(async () => {
        await i18n.init();
        dayjs.extend(duration);
        dayjs.extend(utc);
        dayjs.extend(customParseFormat);
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        if (container) {
            unmountComponentAtNode(container);
            container.remove();
            container = null;
        }
    });

    it("renders ticket-list correctly", async () => {
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <TicketList/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });
})
