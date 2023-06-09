import i18n from '../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import Contacts from './contacts';
import Router from "react-router-dom";
import Api from '@shared/services/api';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Contacts tests", () => {
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
        ticketState: {
            lookupValues: []
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

    it("renders contacts correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' });
        jest.spyOn(Api, 'get').mockImplementation((url:string) => {
            if (url.includes('states')) {
                return new Promise((resolve) =>
                    resolve({data: [
                        {
                            stateCode: 'AL',
                            name: 'Alabama'
                        },

                    ]
                }))
            } else {
                return new Promise((resolve) =>
                    resolve({
                        data: []
                    })
                )
            }
        });
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <Contacts/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });
})
