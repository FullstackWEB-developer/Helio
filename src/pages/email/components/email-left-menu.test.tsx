import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, act, screen} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import EmailLeftMenu from './email-left-menu';
import Router from "react-router-dom";
import EmailProvider, { EmailContext } from '@pages/email/context/email-context';
import { EmailQueryType } from '../models/email-query-type';
import { ChannelTypes, TicketMessageSummaryRequest } from '@shared/models';
import MockDate from 'mockdate';

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Email Left Menu tests", () => {
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
        MockDate.set(dayjs('2018-04-04T16:00:00.000Z').toDate());
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
        MockDate.reset();
    });

    it("renders email-left-menu correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' });
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                    <EmailProvider>
                        <EmailLeftMenu/>
                    </EmailProvider>
                </TestWrapper>);
                fragment = asFragment;
        })
        expect(fragment()).toMatchSnapshot();
    });

    it("apply button", async () => {
        let setEmailQueryTypeMock = (_: EmailQueryType) => {};
        let setQueryParamsMock = (_: TicketMessageSummaryRequest) => {};
        const providerValues = {
            emailQueryType: EmailQueryType.TeamEmail,
            setEmailQueryType: setEmailQueryTypeMock,
            queryParams: {
                channel: ChannelTypes.Email,
                assignedTo: '',
                fromDate: '',
                page: 1,
                pageSize: 25
            } as TicketMessageSummaryRequest,
            setQueryParams: setQueryParamsMock,
            getEmailsQuery: {
                isFetchingNextPage: false,
            },
            isDefaultTeamView: '',
            isLoadingContactNames: false,
            isFetchingContactNames: false
        }
        await act(async () => {
            render(<TestWrapper mockState={mockState}>
                <EmailContext.Provider value={providerValues as any}>
                    <EmailLeftMenu/>
                </EmailContext.Provider>
            </TestWrapper>);
            fireEvent.change(screen.getByTestId("timePeriod_3"), {target: {value: true}});
            fireEvent.change(screen.getByTestId("fromDate"), {target: {value: '10/10/2020'}});
            fireEvent.change(screen.getByTestId("toDate"), {target: {value: '10/10/2021'}});
            fireEvent.change(screen.getByTestId("assignedTo"), {target: {value: ''}});
            fireEvent.click(screen.getByTestId("apply-button"));
        });
    });

    it("onDropDownClick - to my email", async () => {
        let setEmailQueryTypeMock = (_: EmailQueryType) => {};
        let setQueryParamsMock = (_: TicketMessageSummaryRequest) => {};
        const providerValues = {
            emailQueryType: EmailQueryType.TeamEmail,
            setEmailQueryType: setEmailQueryTypeMock,
            queryParams: {
                channel: ChannelTypes.Email,
                assignedTo: '',
                fromDate: '',
                page: 1,
                pageSize: 25
            } as TicketMessageSummaryRequest,
            setQueryParams: setQueryParamsMock,
            getEmailsQuery: {
                isFetchingNextPage: false,
            },
            isDefaultTeamView: '',
            isLoadingContactNames: false,
            isFetchingContactNames: false
        }
        await act(async () => {
            render(<TestWrapper mockState={mockState}>
                <EmailContext.Provider value={providerValues as any}>
                    <EmailLeftMenu/>
                </EmailContext.Provider>
            </TestWrapper>);
            fireEvent.click(screen.getByTestId("email-query-type-changer"));
        });
    });

    it("onDropDownClick - to team email", async () => {
        let setEmailQueryTypeMock = (_: EmailQueryType) => {};
        let setQueryParamsMock = (_: TicketMessageSummaryRequest) => {};
        const providerValues = {
            emailQueryType: EmailQueryType.MyEmail,
            setEmailQueryType: setEmailQueryTypeMock,
            queryParams: {
                channel: ChannelTypes.Email,
                assignedTo: '',
                fromDate: '',
                page: 1,
                pageSize: 25
            } as TicketMessageSummaryRequest,
            setQueryParams: setQueryParamsMock,
            getEmailsQuery: {
                isFetchingNextPage: false,
            },
            isDefaultTeamView: '',
            isLoadingContactNames: false,
            isFetchingContactNames: false
        }
        await act(async () => {
            render(<TestWrapper mockState={mockState}>
                <EmailContext.Provider value={providerValues as any}>
                    <EmailLeftMenu/>
                </EmailContext.Provider>
            </TestWrapper>);
            fireEvent.click(screen.getByTestId("email-query-type-changer"));
        });
    });
})
