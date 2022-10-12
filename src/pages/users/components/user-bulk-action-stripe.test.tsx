import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, wait, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import UserBulkActionStripe from './user-bulk-action-stripe';
import { act } from 'react-dom/test-utils';
import Router from "react-router";
import Api from '@shared/services/api';
import { ExternalUser, InviteUserModel, PagedList, SelectExternalUser, UserActiveDirectory } from '@shared/models';
import { BulkAddStep } from '../models/bulk-add-step.enum';
jest.setTimeout(30000);
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
describe("UserBulkActionStripe tests", () => {

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
        usersState: {
            selectedExternalUsers: [
                {
                    inviteUserModel: {
                        email: "string0",
                        firstName: "string0",
                        lastName: "string0",
                        name: "string0",
                        providerId: "string0",
                        roles: ["string0"]
                    } as InviteUserModel,
                    id: "string0",
                    info: {
                        azureId: "string0",
                        department: "Test",
                        jobTitle: "Test"
                    } as ExternalUser
                }
            ] as SelectExternalUser[],
            bulkPaging: {
                page: 1,
                pageSize: 25,
                totalCount: 2,
                totalPages: 1
            },
            selectedUsersLocalPagination: {
                page: 1,
                pageSize: 1,
                totalCount: 2,
                totalPages: 2
            },
            externalDepartments: ["Test", "Test2"],
            externalJobTitles: ["Test", "Test2"]
        },
        layoutState: {
            isNavigationExpanded: false
        },
        lookupsState: {
            providerList: [
                {
                    firstName: "string",
                    specialty: "string",
                    homeDepartment: "string",
                    specialtyId: 0,
                    schedulingName: "string",
                    providerTypeId: "string",
                    billable: false,
                    displayName: "string",
                    ansiNameCode: "string",
                    lastName: "string",
                    id: 0,
                    providerUserName: "string",
                    ansiSpecialtyCode: "string",
                    hideInPortal: true,
                    sex: "string",
                    entityType: 0,
                    providerType: "string",
                    createEncounterOnCheckin: false
                },{
                    firstName: "string",
                    specialty: "string",
                    homeDepartment: "string",
                    specialtyId: 1,
                    schedulingName: "string",
                    providerTypeId: "string",
                    billable: false,
                    displayName: "string",
                    ansiNameCode: "string",
                    lastName: "string",
                    id: 1,
                    providerUserName: "string",
                    ansiSpecialtyCode: "string",
                    hideInPortal: true,
                    sex: "string",
                    entityType: 0,
                    providerType: "string",
                    createEncounterOnCheckin: false
                }
            ],
            roleList: [
                {
                    name: "string0",
                    description: "string0",
                },{
                    name: "string1",
                    description: "string1",
                }
            ]
        },
        appState: {
            smsTemplates: [],
            emailTemplates: []
        },
        snackbarState: {
            messages: []
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

    it("renders UserBulkActionStripe-Selection correctly checked", async () => {
        let fragment: any;
        
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <UserBulkActionStripe currentStep={BulkAddStep.Selection}/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.input(getByTestId('search'), {target: {value: 'checked'}});
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders UserBulkActionStripe-Selection correctly", async () => {
        let fragment: any;
        
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <UserBulkActionStripe currentStep={BulkAddStep.Selection}/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.click(getByTestId('bulk-check-all'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders UserBulkActionStripe-RolePicking correctly", async () => {
        let fragment: any;
        
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <UserBulkActionStripe currentStep={BulkAddStep.RolePicking}/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders UserBulkActionStripe-Review correctly", async () => {
        let fragment: any;
        
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <UserBulkActionStripe currentStep={BulkAddStep.Review}/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders UserBulkActionStripe-ProviderMapping correctly", async () => {
        let fragment: any;
        
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <UserBulkActionStripe currentStep={BulkAddStep.ProviderMapping}/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });
})