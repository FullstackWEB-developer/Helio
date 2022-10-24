import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import Feedback from './feedback';
import Router from "react-router";
import Api from '@shared/services/api';
import { FeedbackResponse } from '@pages/tickets/models/feedback-response';
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
describe("Feedback tests", () => {
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

    it("renders Feedback not-verified", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ ticketId: "ticket-department", ratingOption: "-1" })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Feedback/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders Feedback correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ ticketId: "00000000-0000-0000-0000-000000000000", ratingOption: "-1" })
        jest.spyOn(Api, 'post').mockResolvedValue(true);
        let fragment: any;
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <Feedback/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.change(getByTestId('note-context-notes'), { target: { value: "Test"}});
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('submit-button'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders Feedback preview correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ isPreview: 'true', logoPath: 'practice-logo.svg', primaryColor: '00cc88', secondaryColor: '00cc88', hoverColor: '2dbe7e', focusedColor: '2ab378', tertiaryColor: '212121'})
        jest.spyOn(URLSearchParams.prototype, 'get').mockImplementation((url) => {
            if (url.includes('isPreview')) {
                return 'true';
            } else if(url.includes('logoPath')){
                return 'practice-logo.svg';
            } else {
                return '00cc88'
            }
        });
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Feedback/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });
})
