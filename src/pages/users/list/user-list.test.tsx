import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, wait, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import UserList from './user-list';
import { act } from 'react-dom/test-utils';
import { CallForwardingType, ExternalUser, InviteUserModel, PagedList, SelectExternalUser, UserActiveDirectory, UserDetail, UserDetailExtended, UserDetailStatus, UserInvitationStatus } from '@shared/models';
import { TicketEnumValue } from '@pages/tickets/models/ticket-enum-value.model';
import Api from '@shared/services/api';
import store from '@app/store';
jest.setTimeout(30000);
describe("UserList tests", () => {
    
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
            paging: {
                page: 1,
                pageSize: 1,
                totalCount: 2,
                totalPages: 2
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
                searchText: "Test"
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

    it("renders UserList correctly multiple", async () => {
        let fragment: any;
        var response = {
            data: {
                page: 1,
                pageSize: 1,
                totalPages: 3,
                totalCount: 3,
                results: [
                    {
                        callForwardingEnabled: false,
                        callNotification: false,
                        chatNotification: true,
                        createdByName: "A",
                        department: "A",
                        email: "a@a.com",
                        emailNotification: true,
                        firstName: "A",
                        fullName: "A B",
                        id: "0",
                        jobTitle: "C",
                        lastName: "B",
                        modifiedByName: "A",
                        profilePicture: "",
                        roles: ["1"],
                        smsNotification: true,
                        status: UserDetailStatus.Active,
                        invitationStatus: UserInvitationStatus.Accepted
                    },{
                        callForwardingEnabled: false,
                        callNotification: false,
                        chatNotification: true,
                        createdByName: "A",
                        department: "A",
                        email: "a@a.com",
                        emailNotification: true,
                        firstName: "A",
                        fullName: "A B",
                        id: "1",
                        jobTitle: "C",
                        lastName: "B",
                        modifiedByName: "A",
                        profilePicture: "",
                        roles: ["1"],
                        smsNotification: true,
                        status: UserDetailStatus.Active,
                        invitationStatus: UserInvitationStatus.Sent
                    },{
                        callForwardingEnabled: false,
                        callNotification: false,
                        chatNotification: true,
                        createdByName: "A",
                        department: "A",
                        email: "a@a.com",
                        emailNotification: true,
                        firstName: "A",
                        fullName: "A B",
                        id: "2",
                        jobTitle: "C",
                        lastName: "B",
                        modifiedByName: "A",
                        profilePicture: "",
                        roles: ["1"],
                        smsNotification: true,
                        status: UserDetailStatus.Active,
                        invitationStatus: UserInvitationStatus.NoInvite
                    }
                ]
            } as PagedList<UserDetail>
        } as any
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <UserList/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.click(getByTestId('next-page'));
            });
        });
        expect(Api.get).toHaveBeenCalledTimes(7);
        expect(fragment()).toMatchSnapshot();
    });

    it("renders UserList correctly edit", async () => {
        let fragment: any;
        var response = {
            data: {
                page: 1,
                pageSize: 1,
                totalPages: 1,
                totalCount: 1,
                results: [
                    {
                        callForwardingEnabled: false,
                        callNotification: false,
                        chatNotification: true,
                        createdByName: "A",
                        department: "A",
                        email: "a@a.com",
                        emailNotification: true,
                        firstName: "A",
                        fullName: "A B",
                        id: "0",
                        jobTitle: "C",
                        lastName: "B",
                        modifiedByName: "A",
                        profilePicture: "",
                        roles: ["1"],
                        smsNotification: true,
                        status: UserDetailStatus.Active,
                        invitationStatus: UserInvitationStatus.Accepted
                    }
                ]
            } as PagedList<UserDetail>
        } as any
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <UserList/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.click(getByTestId('user-list-0-more-menu-toggle'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('users.list_section.edit'));
            });
        });
        expect(Api.get).toHaveBeenCalledTimes(7);
        expect(fragment()).toMatchSnapshot();
    });

    it("renders UserList correctly resend_invite", async () => {
        let fragment: any;
        var response = {
            data: {
                page: 1,
                pageSize: 1,
                totalPages: 1,
                totalCount: 1,
                results: [
                    {
                        callForwardingEnabled: false,
                        callNotification: false,
                        chatNotification: true,
                        createdByName: "A",
                        department: "A",
                        email: "a@a.com",
                        emailNotification: true,
                        firstName: "A",
                        fullName: "A B",
                        id: "0",
                        jobTitle: "C",
                        lastName: "B",
                        modifiedByName: "A",
                        profilePicture: "",
                        roles: ["1"],
                        smsNotification: true,
                        status: UserDetailStatus.Active,
                        invitationStatus: UserInvitationStatus.Sent
                    }
                ]
            } as PagedList<UserDetail>
        } as any
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        jest.spyOn(Api, 'put').mockResolvedValue(true);
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <UserList/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.click(getByTestId('user-list-0-more-menu-toggle'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('users.list_section.resend_invite'));
            });
        });
        expect(Api.get).toHaveBeenCalledTimes(7);
        expect(Api.put).toHaveBeenCalledTimes(0);
        expect(fragment()).toMatchSnapshot();
    });

    it("renders UserList correctly enable", async () => {
        let fragment: any;
        var response = {
            data: {
                page: 1,
                pageSize: 1,
                totalPages: 1,
                totalCount: 1,
                results: [
                    {
                        callForwardingEnabled: false,
                        callNotification: false,
                        chatNotification: true,
                        createdByName: "A",
                        department: "A",
                        email: "a@a.com",
                        emailNotification: true,
                        firstName: "A",
                        fullName: "A B",
                        id: "0",
                        jobTitle: "C",
                        lastName: "B",
                        modifiedByName: "A",
                        profilePicture: "",
                        roles: ["1"],
                        smsNotification: true,
                        status: UserDetailStatus.Inactive,
                        invitationStatus: UserInvitationStatus.Accepted
                    }
                ]
            } as PagedList<UserDetail>
        } as any
        var responseUpdate = {
            data: {
                callForwardingEnabled: false,
                callNotification: false,
                chatNotification: true,
                createdByName: "A",
                department: "A",
                email: "a@a.com",
                emailNotification: true,
                firstName: "A",
                fullName: "A B",
                id: "0",
                jobTitle: "C",
                lastName: "B",
                modifiedByName: "A",
                profilePicture: "",
                roles: ["1"],
                smsNotification: true,
                status: UserDetailStatus.Active,
                invitationStatus: UserInvitationStatus.Accepted
            }
        } as any
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        jest.spyOn(Api, 'put').mockResolvedValue(responseUpdate);
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <UserList/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.click(getByTestId('user-list-0-more-menu-toggle'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('users.list_section.enable'));
            });
        });
        expect(Api.get).toHaveBeenCalledTimes(7);
        expect(Api.put).toHaveBeenCalledTimes(1);
        expect(fragment()).toMatchSnapshot();
    });

    it("renders UserList correctly disable", async () => {
        let fragment: any;
        var response = {
            data: {
                page: 1,
                pageSize: 1,
                totalPages: 1,
                totalCount: 1,
                results: [
                    {
                        callForwardingEnabled: false,
                        callNotification: false,
                        chatNotification: true,
                        createdByName: "A",
                        department: "A",
                        email: "a@a.com",
                        emailNotification: true,
                        firstName: "A",
                        fullName: "A B",
                        id: "0",
                        jobTitle: "C",
                        lastName: "B",
                        modifiedByName: "A",
                        profilePicture: "",
                        roles: ["1"],
                        smsNotification: true,
                        status: UserDetailStatus.Active,
                        invitationStatus: UserInvitationStatus.Accepted
                    }
                ]
            } as PagedList<UserDetail>
        } as any
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        await act(async () => {
            const {asFragment, getByTestId} = render(<TestWrapper mockState={mockState}>
                <UserList/>          
            </TestWrapper>);
            fragment = asFragment;
            await waitFor(() => {
                fireEvent.click(getByTestId('user-list-0-more-menu-toggle'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('users.list_section.disable'));
            });
        });
        
        expect(Api.get).toHaveBeenCalledTimes(7);
        expect(fragment()).toMatchSnapshot();
    });
})