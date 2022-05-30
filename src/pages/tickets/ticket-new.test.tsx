import i18n from '../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import React from 'react'
import TestWrapper from '@shared/test-utils/test-wrapper';
import TicketNew from '@pages/tickets/ticket-new';
import {User} from '@shared/models';

describe("Ticket New tests", () => {
    let container: HTMLDivElement | null;
    let mockState = {
        ticketState: {
            lookupValues: []
        },
        appUserState: {
            liveAgentStatuses: []
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
        },
        contactState : {
            contacts: []
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

    it("renders new-ticket correctly", async () => {
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <TicketNew
            />
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });
})
