import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, wait, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import UserListNoResult from './user-list-no-results';
import { act } from 'react-dom/test-utils';
import { CallForwardingType, ExternalUser, InviteUserModel, PagedList, SelectExternalUser, UserActiveDirectory, UserDetail, UserDetailExtended, UserDetailStatus, UserInvitationStatus } from '@shared/models';
import { TicketEnumValue } from '@pages/tickets/models/ticket-enum-value.model';
jest.setTimeout(30000);
describe("UserListNoResult tests", () => {
    
    let container: HTMLDivElement | null;
    let mockState = {
        emailState: {
            unreadEmails: 0,
            messageSummaries: []
        },
        appUserState: {
            liveAgentStatuses: [
                {
                    userId: "string",
                    name: "string",
                    status: "string",
                    profilePicture: "string",
                    timestamp: new Date('2022-10-07'),
                    calls: [],
                    chats: []
                }
            ],
            appUserDetails: {
                id: "",
                permissions: ["Users.EditUserDetail"]
            },
            auth: {
                accessToken: "string",
                name: "string",
                username: "string",
                expiresOn: new Date('2022-10-7'),
                isLoggedIn: false,
                profilePicture: "string",
                authenticationLink: "string",
                id: "123",
                isGuestLogin: false,
                firstLoginTime: new Date('2022-10-7')
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
                pageSize: 25,
                totalCount: 2,
                totalPages: 1
            },
            statusList: [{
                key: 1,
                value: "A"
            },{
                key: 2,
                value: "B"
            }] as TicketEnumValue[],
            invitationStatusList: [{
                key: 1,
                value: "A"
            },{
                key: 2,
                value: "B"
            }] as TicketEnumValue[],
            departments: ["A", "B"],
            jobTitles: ["A", "B"],
            filters: {
                jobTitle:"A",
                departments:"A",
                roles:"string0",
                invitationStatuses:"1",
                statuses:"1",
            }
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
            ],
            forwardToOptions: [{
                    key: 1,
                    value: "Test"
            }] as TicketEnumValue[]
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

    it("renders UserListNoResult correctly add-user", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <UserListNoResult/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.click(getByTestId('add-user'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders UserListNoResult correctly add-bulk-user", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <UserListNoResult/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.click(getByTestId('add-bulk-user'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders UserListNoResult correctly reset", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <UserListNoResult/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.click(getByTestId('reset'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders UserListNoResult correctly back", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <UserListNoResult/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.click(getByTestId('back'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });
})