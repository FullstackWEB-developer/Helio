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
import {TicketEnumValue} from '@pages/tickets/models/ticket-enum-value.model';
import MockDate from 'mockdate';

fdescribe("Ticket List tests", () => {
    let container: HTMLDivElement | null;
    const mockState = {
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
            }] as User[],
            ratingOptions: [
                {
                    key: 1,
                    value: 'Happy'
                }
            ] as TicketEnumValue[]
        }
    };

    beforeEach(async () => {
        await i18n.init();
        MockDate.set(dayjs('2018-04-04T16:00:00.000Z').toDate());
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
        MockDate.reset();
    });

    it("renders ticket-list correctly", async () => {
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <TicketList/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });
})
