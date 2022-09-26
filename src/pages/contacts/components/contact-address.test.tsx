import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import ContactAddress from './contact-address';
import Router from "react-router-dom";
import { AddressType, AssociatedContact, ContactExtended, ContactType } from '@shared/models';
import { Control, useForm } from 'react-hook-form';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("ContactAddress tests", () => {
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

    it("renders ContactAddress-PrimaryAddress correctly", async () => {
        const Component = () => {
            const { control } = useForm<{
              test: string;
              test1: { test: string }[];
            }>();

            jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <ContactAddress title='Test' addressType={AddressType.PrimaryAddress} control={control} />
            </TestWrapper>);
            expect(asFragment()).toMatchSnapshot();
      
            return null;
          };
      
        render(<Component />);
        
    });

    it("renders ContactAddress-BillingAddress correctly", async () => {
        const Component = () => {
            const { control } = useForm<{
              test: string;
              test1: { test: string }[];
            }>();

            jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <ContactAddress title='Test' addressType={AddressType.BillingAddress} control={control} />
            </TestWrapper>);
            expect(asFragment()).toMatchSnapshot();
      
            return null;
          };
      
        render(<Component />);
        
    });

    it("renders ContactAddress-ShippingAddress correctly", async () => {
        const Component = () => {
            const { control } = useForm<{
              test: string;
              test1: { test: string }[];
            }>();

            jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1234' })
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <ContactAddress title='Test' addressType={AddressType.ShippingAddress} control={control} />
            </TestWrapper>);
            expect(asFragment()).toMatchSnapshot();
      
            return null;
          };
      
        render(<Component />);
        
    });
})