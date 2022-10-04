import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {render, fireEvent, act, screen} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import EmailFilter from './email-filter';
import Router from "react-router-dom";
import MockDate from 'mockdate';

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("Email Filter tests", () => {
    let container: HTMLDivElement | null;
    let mockState = {
        emailState: {
            unreadEmails: 0
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

    it("renders email-filter correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' });
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <EmailFilter/>
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders email-filter isUserFilterEnabled", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' });
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <EmailFilter isUserFilterEnabled={true}/>
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders email-filter timePeriod_3", async () => {
        await act(async () => {
            render(<TestWrapper mockState={mockState}>
                <EmailFilter isUserFilterEnabled={true}/>
            </TestWrapper>);
            fireEvent.click(await screen.getByTestId("timePeriod_3"));
            fireEvent.click(await screen.getByTestId("apply-button"));
        });

    });

        it("renders email-filter timePeriod_2", async () => {
            await act(async () => {
                render(<TestWrapper mockState={mockState}>
                    <EmailFilter isUserFilterEnabled={true}/>
                </TestWrapper>);
                fireEvent.click(await screen.getByTestId("timePeriod_2"));
                fireEvent.click(await screen.getByTestId("apply-button"));
            });

        });

        it("renders email-filter timePeriod_1", async () => {
            await act(async () => {
                render(<TestWrapper mockState={mockState}>
                    <EmailFilter isUserFilterEnabled={true}/>
                </TestWrapper>);
                fireEvent.click(await screen.getByTestId("timePeriod_1"));
                fireEvent.click(await screen.getByTestId("apply-button"));
            });

        });

        it("renders email-filter timePeriod_0", async () => {
            await act(async () => {
                render(<TestWrapper mockState={mockState}>
                    <EmailFilter isUserFilterEnabled={true}/>
                </TestWrapper>);
                fireEvent.click(await screen.getByTestId("timePeriod_0"));
                fireEvent.click(await screen.getByTestId("apply-button"));
            });

        });

        it("renders email-filter reset-all-button", async () => {
            await act(async () => {
                render(<TestWrapper mockState={mockState}>
                    <EmailFilter isUserFilterEnabled={true}/>
                </TestWrapper>);
                fireEvent.click(await screen.getByTestId("reset-all-button"));
            });
        });
})
