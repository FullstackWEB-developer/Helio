import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import ContactListItem from './contact-list-item';
import Router from "react-router-dom";
import { AddressType, AssociatedContact, Contact, ContactExtended, ContactType } from '@shared/models';
import { Control, useForm } from 'react-hook-form';
import { ContactAvatarModel } from '../models/contact-avatar-model';
import { Icon } from '@components/svg-icon';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("ContactListItem tests", () => {
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
            },
            auth: {
                name: "Test"
            }
        },
        lookupsState: {

        },
        ticketState: {
            lookupValues: [{
                label: "Test",
                parentValue: "Test"
            },{
                label: "Test",
                parentValue: "Test"
            }]
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

    it("renders ContactListItem return correctly", async () => {
        let contact = {
            category: 1,
            companyName: "",
            firstName: "",
            id: "123",
            lastName: "",
            mobilePhone: "",
            name: "",
            type: ContactType.Individual,
            workMainPhone: "",
        } as Contact;
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
            <ContactListItem contact={contact}/>
        </TestWrapper>);
        fireEvent.click(getByTestId(contact.id))
        expect(asFragment()).toMatchSnapshot();
    });
})