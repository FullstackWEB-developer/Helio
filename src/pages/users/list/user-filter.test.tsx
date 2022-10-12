import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, wait, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import UserFilter from './user-filter';
import { act } from 'react-dom/test-utils';
import Router from "react-router";
import Api from '@shared/services/api';
import { CallForwardingType, ExternalUser, InviteUserModel, PagedList, SelectExternalUser, UserActiveDirectory, UserDetailExtended, UserDetailStatus, UserInvitationStatus } from '@shared/models';
import { TicketEnumValue } from '@pages/tickets/models/ticket-enum-value.model';
jest.setTimeout(30000);
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ userId: "123" }),
  }))
describe("UserFilter tests", () => {
    
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

    it("renders UserFilter correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ userId: "123" });
        let fragment: any;
        await act(async () => {
            const {asFragment, getByTestId, container} = render(<TestWrapper mockState={mockState}>
                <UserFilter isOpen={true}/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.change(getByTestId('statuses-checkbox-1'), { target: { value: "checked"}});
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('apply-button'));
            });
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders UserFilter correctly without filter", async () => {
        let mockStateLocal = {
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
        jest.spyOn(Router, 'useParams').mockReturnValue({ userId: "123" });
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockStateLocal}>
                <UserFilter isOpen={true}/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders UserFilter correctly-false", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ userId: "123" });
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <UserFilter isOpen={false}/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });
})