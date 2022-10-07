import i18n from '../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import Configurations from './configurations';
import Router from "react-router";
import Api from '@shared/services/api';
import { PracticeEmailTemplate } from './models/practice-email-template';
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
describe("Configurations tests", () => {
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

    it("renders Configurations-Ticket Department correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ type: "ticket-department" })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Configurations/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });
    
    it("renders ticket-department correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ type: "ticket-department" })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Configurations/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders ticket-tags correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ type: "ticket-tags" })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Configurations/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders appointment-reminders correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ type: "appointment-reminders" })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Configurations/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders public-links correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ type: "public-links" })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Configurations/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders contact-categories correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ type: "contact-categories" })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Configurations/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders email-templates correctly", async () => {
        var response = {
            data: [{
                id: "string1",
                subject: "string",
                templateBody: "string",
                layoutName: "string",
                name: "string",
                description: "string",
                title: "string",
                defaultBody: "string",
                body: "string",
                createdByName: "string",
                createdOn: new Date(),
                modifiedByName: "string",
                modifiedOn: new Date(),
            },{
                id: "string2",
                subject: "string",
                templateBody: "string",
                layoutName: "string",
                name: "string",
                description: "string",
                title: "string",
                defaultBody: "string",
                body: "string",
                createdByName: "string",
                createdOn: new Date(),
                modifiedByName: "string",
                modifiedOn: new Date(),
            }]
        }
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        jest.spyOn(Router, 'useParams').mockReturnValue({ type: "email-templates" })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Configurations/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders email-templates with id correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ type: "email-templates", id: "123" })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Configurations/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders security correctly", async () => {
        var response = {
            data: {
                response: {
                    hipaaVerificationRetryNumber: 0,
                    verifiedPatientExpiresInDays: 0,
                    medicalRecordsDownloadExpirationInDays: 0,
                    redirectLinkExpirationInHours: 0,
                    verificationFailWaitInMinutes: 0,
                    guestSmsExpirationInHours: 0,
                }
            }
        }
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        jest.spyOn(Router, 'useParams').mockReturnValue({ type: "security" })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Configurations/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders general correctly", async () => {
        var response = {
            data: {
                forceToRedirect: false,
                redirectToExternalPhone: "8446370052",
                infoEmailAddress: "abc@def.com",
                infoPhoneNumber: "2122121212",
                deletedDepartments: ""
            }
        }
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        jest.spyOn(Router, 'useParams').mockReturnValue({ type: "general" })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Configurations/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders patient-tabs correctly", async () => {
        var response = {
            data: {
                isInsuranceVisible: true,
                isAppointmentsVisible: true,
                isPatientCasesVisible: true,
                isMedicationsVisible: true,
                isTestResultsVisible: true,
            }
        }
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        jest.spyOn(Router, 'useParams').mockReturnValue({ type: "patient-tabs" })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Configurations/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders practice-email-template correctly", async () => {
        var response = {
            data: {
                headerImage: "string",
                footerImage: "string",
                footerDisclaimer: "string"
            } as PracticeEmailTemplate
        } as any
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        jest.spyOn(Router, 'useParams').mockReturnValue({ type: "practice-email-template" })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Configurations/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders default correctly", async () => {
        jest.spyOn(Api, 'get').mockResolvedValue({});
        jest.spyOn(Router, 'useParams').mockReturnValue({  })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Configurations/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });
})
