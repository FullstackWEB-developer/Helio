import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import AssociatedContactsItem from './associated-contacts-item';
import Router from "react-router-dom";
import { AssociatedContact, ContactType } from '@shared/models';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("AddNewContact tests", () => {
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

    it("renders AddNewContact correctly", async () => {
        let contact = {
            companyName: "",
            firstName: "",
            id: "123",
            lastName: "",
            type: ContactType.Company
        } as AssociatedContact;
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
            <AssociatedContactsItem contact={contact}/>
        </TestWrapper>);
        fireEvent.click(getByTestId(contact.id));
        expect(asFragment()).toMatchSnapshot();
    });
})
