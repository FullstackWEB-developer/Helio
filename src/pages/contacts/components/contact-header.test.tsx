import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import ContactHeader from './contact-header';
import Router from "react-router-dom";
import { AddressType, AssociatedContact, Contact, ContactExtended, ContactType } from '@shared/models';
import { Control, useForm } from 'react-hook-form';
import { ContactAvatarModel } from '../models/contact-avatar-model';
import { Icon } from '@components/svg-icon';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("ContactHeader tests", () => {
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

    it("renders ContactHeader return correctly", async () => {
        let contact = {
            category: 1,
            companyName: "",
            firstName: "",
            id: "",
            lastName: "",
            mobilePhone: "",
            name: "",
            type: ContactType.Individual,
            workMainPhone: "",
            description: "Test",
            jobTitle: "Test"
        } as Contact;
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <ContactHeader contact={contact} editMode={false} isDeleting={false} isStarring={false}/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders ContactHeader company return correctly", async () => {
        let contact = {
            category: 1,
            companyName: "",
            firstName: "Test",
            id: "",
            lastName: "Test",
            mobilePhone: "",
            name: "",
            type: ContactType.Company,
            workMainPhone: "",
        } as Contact;
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <ContactHeader contact={contact} editMode={false} isDeleting={false} isStarring={false}/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });
})