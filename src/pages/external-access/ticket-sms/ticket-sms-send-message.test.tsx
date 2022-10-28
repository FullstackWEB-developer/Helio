import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import TicketSmsSendMessage from './ticket-sms-send-message';
import { TicketMessage, UserBase, UserDetailStatus } from '@shared/models';
import Api from '@shared/services/api';
jest.setTimeout(70000);
describe("TicketSmsSendMessage tests", () => {
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
        },
        externalAccessState: {
            verifyPatientState: {
                phoneNumber: "5515283307"
            },
            ticketSmsState: {}
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

    it("renders TicketSmsSendMessage contact correctly", async () => {
        let fragment: any;
        let result = {
            data: {
                mobilePhone: "5515283307"
            }
        };
        jest.spyOn(Api, 'post').mockResolvedValue(true);
        jest.spyOn(Api, 'get').mockResolvedValue(result);
        await act(async () => {
            const {asFragment, getByPlaceholderText, getByTestId} = render(<TestWrapper mockState={mockState}>
                <TicketSmsSendMessage onMessageSend={() => {}} ticketId={"string"} contactId={"123"}/>
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.input(getByPlaceholderText('external_access.ticket_sms.type'), { target: { value: "Test"}});
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('svg-icon'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders TicketSmsSendMessage contact wrong number correctly", async () => {
        let fragment: any;
        let result = {
            data: {
                mobilePhone: "5515283306"
            }
        };
        jest.spyOn(Api, 'post').mockResolvedValue(true);
        jest.spyOn(Api, 'get').mockResolvedValue(result);
        await act(async () => {
            const {asFragment, getByPlaceholderText, getByTestId} = render(<TestWrapper mockState={mockState}>
                <TicketSmsSendMessage onMessageSend={() => {}} ticketId={"string"} contactId={"123"}/>
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.input(getByPlaceholderText('external_access.ticket_sms.type'), { target: { value: "Test"}});
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('svg-icon'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders TicketSmsSendMessage contact empty message correctly", async () => {
        let fragment: any;
        let result = {
            data: {
                mobilePhone: "5515283306"
            }
        };
        jest.spyOn(Api, 'post').mockResolvedValue(true);
        jest.spyOn(Api, 'get').mockResolvedValue(result);
        await act(async () => {
            const {asFragment, getByPlaceholderText, getByTestId} = render(<TestWrapper mockState={mockState}>
                <TicketSmsSendMessage onMessageSend={() => {}} ticketId={"string"} contactId={"123"}/>
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.input(getByPlaceholderText('external_access.ticket_sms.type'), { target: { value: ""}});
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('svg-icon'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders TicketSmsSendMessage empty message correctly", async () => {
        let fragment: any;
        let result = {
            data: {
                mobilePhone: "5515283306"
            }
        };
        jest.spyOn(Api, 'post').mockResolvedValue(true);
        jest.spyOn(Api, 'get').mockResolvedValue(result);
        await act(async () => {
            const {asFragment, getByPlaceholderText, getByTestId} = render(<TestWrapper mockState={mockState}>
                <TicketSmsSendMessage onMessageSend={() => {}} ticketId={"string"} />
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.input(getByPlaceholderText('external_access.ticket_sms.type'), { target: { value: "Test"}});
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('svg-icon'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders TicketSmsSendMessage empty message error", async () => {
        let fragment: any;
        let result = {
            data: {
                mobilePhone: "5515283307"
            }
        };
        jest.spyOn(Api, 'post').mockImplementation(() => {
            return Promise.reject({statusCode: 404})
        });
        
        jest.spyOn(Api, 'get').mockResolvedValue(result);
        await act(async () => {
            const {asFragment, getByPlaceholderText, getByTestId} = render(<TestWrapper mockState={mockState}>
                <TicketSmsSendMessage onMessageSend={() => {}} ticketId={"string"} contactId={"123"}/>
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.input(getByPlaceholderText('external_access.ticket_sms.type'), { target: { value: "Test"}});
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('svg-icon'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });


    it("renders TicketSmsSendMessage patient correctly", async () => {
        let fragment: any;
        let result = {
            data: {
                mobilePhone: "5515283307"
            }
        };
        jest.spyOn(Api, 'post').mockResolvedValue(true);
        jest.spyOn(Api, 'get').mockResolvedValue(result);
        await act(async () => {
            const {asFragment, getByPlaceholderText, getByTestId} = render(<TestWrapper mockState={mockState}>
                <TicketSmsSendMessage onMessageSend={() => {}} ticketId={"string"} patientId={123}/>
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.input(getByPlaceholderText('external_access.ticket_sms.type'), { target: { value: "Test"}});
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('svg-icon'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });
})
