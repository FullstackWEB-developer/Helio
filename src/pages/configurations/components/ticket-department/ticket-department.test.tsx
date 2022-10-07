import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import TicketDepartment from './ticket-department';
import Api from '@shared/services/api';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("TicketDepartment tests", () => {
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
                key: "Department",
                value: [{
                    label: "string1",
                    parentValue: "string1",
                    isReadOnly: false,
                    key: "Department",
                    value: "1",
                },{
                    label: "string2",
                    parentValue: "string2",
                    isReadOnly: false,
                    key: "Department",
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

    it("renders TicketDepartment correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <TicketDepartment/>          
        </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders TicketDepartment delete", async () => {
        jest.spyOn(Api, 'delete').mockResolvedValue(true);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <TicketDepartment/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId("edit-2"));
                fireEvent.click(getByTestId("delete-department"));
            });
        });
        expect(Api.delete).toHaveBeenCalledTimes(1);
    });

    it("renders TicketDepartment add", async () => {
        jest.spyOn(Api, 'post').mockResolvedValue(true);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <TicketDepartment/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId("add"));
                fireEvent.input(getByTestId("value"),{ target: { value: "Test"}});
                fireEvent.click(getByTestId("save-changes"));
            });
        });
        expect(Api.post).toHaveBeenCalledTimes(1);
    });

    it("renders TicketDepartment update", async () => {
        jest.spyOn(Api, 'put').mockResolvedValue(true);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <TicketDepartment/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId("edit-2"));
                fireEvent.input(getByTestId("value"),{ target: { value: "Test2"}});
                fireEvent.click(getByTestId("save-changes"));
            });
        });
        expect(Api.put).toHaveBeenCalledTimes(1);
    });

    it("renders TicketDepartment cancel", async () => {
        jest.spyOn(Api, 'put').mockResolvedValue(true);
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <TicketDepartment/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId("edit-2"));
                fireEvent.input(getByTestId("value"),{ target: { value: "Test2"}});
                fireEvent.click(getByTestId("cancel-department"));
            });
        });
        expect(Api.put).toHaveBeenCalledTimes(0);
    });
})
