import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import GeneralSettings from './general-settings';
import Api from '@shared/services/api';
import { act } from 'react-dom/test-utils';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("GeneralSettings tests", () => {
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

    it("renders GeneralSettings correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <GeneralSettings/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders GeneralSettings with id correctly", async () => {
        var response = {
            data: {
                forceToRedirect: false,
                redirectToExternalPhone: "8446370052",
                infoEmailAddress: "abc@def.com",
                infoPhoneNumber: "2122121212",
                deletedDepartments: ""
            }
        }
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <GeneralSettings/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.change(getByTestId('forceToRedirect_true'), {target: {value: 'checked'}});
                fireEvent.change(getByTestId("redirectToExternalPhone"), {target: {value: '2012131232'}});
                fireEvent.click(getByTestId("submit"));
            });
        });
        
        expect(Api.get).toHaveBeenCalledTimes(1);
    });
})
