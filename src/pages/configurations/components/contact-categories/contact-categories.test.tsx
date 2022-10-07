import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import ContactCategories from './contact-categories';
import { act } from 'react-dom/test-utils';
import Api from '@shared/services/api';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("ContactCategories tests", () => {
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
        ticketState: {
            lookupValues: [{
                key: "ContactCategory",
                value: [{
                    label: "string1",
                    parentValue: "string1",
                    isReadOnly: false,
                    key: "ContactCategory",
                    value: "1",
                },{
                    label: "string2",
                    parentValue: "string2",
                    isReadOnly: false,
                    key: "ContactCategory",
                    value: "2",
                }
                ]
            }]
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

    it("renders ContactCategories correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <ContactCategories/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders ContactCategories with data correctly delete", async () => {
        jest.spyOn(Api, 'get').mockResolvedValue(false);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <ContactCategories/>
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId('edit-2'));
                fireEvent.click(getByTestId('delete-contact-cat'));
            });
        });
        expect(Api.get).toHaveBeenCalledTimes(2);
    });
})
