import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import CompanyContactDetails from './company-contact-details';
import Router from "react-router-dom";
import { AssociatedContact, ContactExtended, ContactType } from '@shared/models';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("CompanyContactDetails tests", () => {
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
        ticketState: {
            lookupValues: []
        },
        appState: {
            smsTemplates: [],
            emailTemplates: []
        },
        ccpState: {
            chatCounter: 1,
            voiceCounter: 2
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

    it("renders CompanyContactDetails correctly", async () => {
        let contact = {
            companyName: "",
            firstName: "",
            id: "123",
            lastName: "",
            type: ContactType.Company
        } as ContactExtended;
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <CompanyContactDetails contact={contact} addNewContactHandler={() => {}} onUpdateSuccess={() => {}}/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });
})