import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import ContactForm from './contact-form';
import Router from "react-router-dom";
import { Address, AddressType, AssociatedContact, Contact, ContactExtended, ContactType } from '@shared/models';
import { Control, useForm } from 'react-hook-form';
import { ContactAvatarModel } from '../models/contact-avatar-model';
import { Icon } from '@components/svg-icon';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("ContactForm tests", () => {
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

    it("renders ContactForm edit true saving true correctly", async () => {
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
            addresses: [
                {
                    addressType: AddressType.ShippingAddress,
                } as Address,
                {
                    addressType: AddressType.BillingAddress,
                } as Address
            ]
        } as Contact;
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <ContactForm contact={contact} contactType={ContactType.Individual} editMode={true} isSaving={true}/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders ContactForm edit true saving false correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <ContactForm contactType={ContactType.Individual} editMode={true} isSaving={false}/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders ContactForm edit false saving true correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <ContactForm contactType={ContactType.Individual} editMode={false} isSaving={true}/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders ContactForm edit false saving false correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <ContactForm contactType={ContactType.Individual} editMode={false} isSaving={false}/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });
})