import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import TicketTags from './ticket-tags';
import Api from '@shared/services/api';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("TicketTags tests", () => {
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
                key: "TicketTags",
                value: [{
                    label: "string1",
                    parentValue: "string1",
                    isReadOnly: false,
                    key: "TicketTags",
                    value: "1",
                },{
                    label: "string2",
                    parentValue: "string2",
                    isReadOnly: true,
                    key: "TicketTags",
                    value: "3",
                },{
                    label: "string2",
                    parentValue: "string2",
                    isReadOnly: false,
                    key: "TicketTags",
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

    it("renders TicketTags correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <TicketTags/>          
        </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders TicketTags delete", async () => {
        jest.spyOn(Api, 'delete').mockResolvedValue(true);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <TicketTags/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId("edit-2"));
                fireEvent.click(getByTestId("delete-tags"));
            });
        });
        expect(Api.delete).toHaveBeenCalledTimes(1);
    });

    it("renders TicketTags add", async () => {
        jest.spyOn(Api, 'post').mockResolvedValue(true);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <TicketTags/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId("add"));
                fireEvent.input(getByTestId("value"),{ target: { value: "Test"}});
                fireEvent.click(getByTestId("save-changes"));
            });
        });
        expect(Api.post).toHaveBeenCalledTimes(1);
    });

    it("renders TicketTags update", async () => {
        jest.spyOn(Api, 'put').mockResolvedValue(true);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <TicketTags/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId("edit-2"));
                fireEvent.input(getByTestId("value"),{ target: { value: "Test2"}});
                fireEvent.click(getByTestId("save-changes"));
            });
        });
        expect(Api.put).toHaveBeenCalledTimes(1);
    });

    it("renders TicketTags cancel", async () => {
        jest.spyOn(Api, 'put').mockResolvedValue(true);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <TicketTags/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId("edit-2"));
                fireEvent.input(getByTestId("value"),{ target: { value: "Test2"}});
                fireEvent.click(getByTestId("cancel-tags"));
            });
        });
        expect(Api.put).toHaveBeenCalledTimes(0);
    });
})
