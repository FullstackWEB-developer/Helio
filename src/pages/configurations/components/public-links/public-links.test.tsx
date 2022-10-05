import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, fireEvent, render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import PublicLinks from './public-links';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));

Object.assign(navigator, {
    clipboard: {
        writeText: async () => {},
    },
});
describe("PublicLinks tests", () => {
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

    it("renders PublicLinks correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <PublicLinks/>    
        </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders PublicLinks on copy correctly", async () => {
        jest.spyOn(navigator.clipboard, "writeText");
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <PublicLinks/>          
            </TestWrapper>);
            fireEvent.click(getByTestId('onCopy-1'));
        })
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith("http://localhost/o/registration");
    });
})