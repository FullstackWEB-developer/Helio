import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import HipaaWarningModal from './hipaa-warning-modal';
describe("HipaaWarningModal tests", () => {
    let container: HTMLDivElement | null;
    const mockState = {
        emailState: {
            unreadEmails: 0,
            messageSummaries: []
        },
        appUserState: {
            liveAgentStatuses: [],
            appUserDetails: {
                id: ""
            }
        },
        lookupsState: {

        },
        appState: {
            smsTemplates: [],
            emailTemplates: []
        },
        callsLogState: {
            isFiltered: false
        },
        ticketState: {
            lookupValues: []
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

    it("renders HipaaWarningModal correctly ok", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <HipaaWarningModal actionTranslation='external_access.appointments.appointment_canceled'/>          
            </TestWrapper>);
            fragment = asFragment;
            await new Promise((r) => setTimeout(r, 2600));
            await waitFor(async () => {
                fireEvent.click(getByTestId('ok'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders HipaaWarningModal correctly cancel", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <HipaaWarningModal actionTranslation='external_access.appointments.appointment_canceled'/>          
            </TestWrapper>);
            fragment = asFragment;
            await new Promise((r) => setTimeout(r, 2600));
            await waitFor(() => {
                fireEvent.click(getByTestId('close'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });
})
