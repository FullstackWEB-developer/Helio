import i18n from '../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render} from '@testing-library/react';
import Reports from '@pages/reports/reports';
import TestWrapper from '@shared/test-utils/test-wrapper';

describe("Reports tests", () => {
    let container: HTMLDivElement | null;
    let mockState = {
        ticketState: {
            lookupValues: [],
            enumValues: [
                {
                    TicketType: []
                },
                {
                    TicketReason: []
                }
            ]
        },
        appUserState: {
            liveAgentStatuses: []
        },
        appState: {
            smsTemplates: [],
            emailTemplates: []
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

    it("renders reports correctly", async () => {
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <Reports/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });
})
