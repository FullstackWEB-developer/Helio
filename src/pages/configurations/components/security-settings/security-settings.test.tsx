import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import SecuritySettings from './security-settings';
import Api from '@shared/services/api';
import { act } from 'react-dom/test-utils';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("SecuritySettings tests", () => {
    let container: HTMLDivElement | null;
    let mockState = {
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

    it("renders SecuritySettings correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <SecuritySettings/>         
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders SecuritySettings with data correctly", async () => {
        var response = {
            data: {
                response: {
                    hipaaVerificationRetryNumber: 0,
                    verifiedPatientExpiresInDays: 0,
                    medicalRecordsDownloadExpirationInDays: 0,
                    redirectLinkExpirationInHours: 0,
                    verificationFailWaitInMinutes: 0,
                    guestSmsExpirationInHours: 0,
                }
            }
        }
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <SecuritySettings/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId('reset'));
            });
        });
        
        expect(Api.get).toHaveBeenCalledTimes(1);
    });
})