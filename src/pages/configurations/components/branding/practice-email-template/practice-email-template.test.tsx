import i18n from '../../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import PracticeEmailTemplatePage from './practice-email-template';
import Api from '@shared/services/api';
import { PracticeEmailTemplate } from '@pages/configurations/models/practice-email-template';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("PracticeEmailTemplate tests", () => {
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

    it("renders PracticeEmailTemplate correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <PracticeEmailTemplatePage/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders PracticeEmailTemplate with data correctly", async () => {
        var response = {
            data: {
                headerImage: "string",
                footerImage: "string",
                footerDisclaimer: "string"
            } as PracticeEmailTemplate
        } as any
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <PracticeEmailTemplatePage/>
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId('configuration.practice_email_template.reset_to_default_button'));
                fireEvent.click(getByTestId('configuration.practice_email_template.customize_color_description'));
                fireEvent.click(getByTestId('save-practice-email-template'));
            });
        });
        expect(Api.get).toHaveBeenCalledTimes(1);
    });
})
