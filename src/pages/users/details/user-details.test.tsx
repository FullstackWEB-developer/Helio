import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, wait, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import UserDetails from './user-details';
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
describe("UserDetails tests", () => {
    
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

    it("renders UserDetails correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ userId: "123" });
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <UserDetails/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders UserDetails correctly with api", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ userId: "123" });
        jest.spyOn(Api, 'get').mockImplementation((url) => {
            if (url.includes('/extended')) {
                return new Promise((resolve) => {
                    resolve({
                        data: {
                            user: {
                                id: "string",
                                firstName: "string",
                                lastName: "string",
                                email: "string",
                                profilePicture: "string",
                                department: "string",
                                jobTitle: "string",
                                status: UserDetailStatus.Active,
                                roles: ["1","2"],
                                callForwardingEnabled: true,
                                callForwardingType: CallForwardingType.Phone,
                                callForwardingValue: "string",
                                createdByName: "string",
                                modifiedByName: "string",
                                createdOn: "string",
                                modifiedOn: "string",
                                providerId: 1,
                                latestConnectStatus: "string",
                                invitationStatus: UserInvitationStatus.Accepted,
                                permissions: ["1","2"],
                                fullName: "string",
                                chatNotification: true,
                                emailNotification: true,
                                callNotification: true,
                                smsNotification: true,
                            },
                            contactQueues: ["1", "2"],
                            contactProfileLink: "test",
                        } as UserDetailExtended
                    })
                })
            } else if(url.includes('/mobile-phone-number')){
                return new Promise((resolve) => {
                    resolve({
                        data: {
                            mobilePhoneNumber: "5511234565"
                        }
                    })
                })
            } else {
                return new Promise((resolve) => {
                    resolve({
                        data: [{
                            stateCode: 'AL',
                            name: 'Alabama'
                        }]
                    })
                })
            }
        });
        await act(async () => {
            const {getByTestId, container} = render(<TestWrapper mockState={mockState}>
                <UserDetails/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.change(getByTestId('userrole_string0-checkbox-string0'), {target: { value: "checked"}});
            });
            await waitFor(() => {
                fireEvent.change(getByTestId('switch-call'), {target: { value: "checked"}});
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('save'));
            });
        });
        expect(Api.get).toHaveBeenCalledTimes(5);
    });

    it("renders UserDetails correctly with api without role", async () => {
        mockState.lookupsState.roleList=[];
        jest.spyOn(Router, 'useParams').mockReturnValue({ userId: "123" });
        jest.spyOn(Api, 'get').mockImplementation((url) => {
            if (url.includes('/extended')) {
                return new Promise((resolve) => {
                    resolve({
                        data: {
                            user: {
                                id: "string",
                                firstName: "string",
                                lastName: "string",
                                email: "string",
                                profilePicture: "string",
                                department: "string",
                                jobTitle: "string",
                                status: UserDetailStatus.Active,
                                roles: ["1","2"],
                                callForwardingEnabled: true,
                                callForwardingType: CallForwardingType.Agent,
                                callForwardingValue: "string",
                                createdByName: "string",
                                modifiedByName: "string",
                                createdOn: "string",
                                modifiedOn: "string",
                                providerId: 2,
                                latestConnectStatus: "string",
                                invitationStatus: UserInvitationStatus.Accepted,
                                permissions: ["1","2"],
                                fullName: "string",
                                chatNotification: true,
                                emailNotification: true,
                                callNotification: true,
                                smsNotification: true,
                            },
                            contactQueues: ["1", "2"],
                            contactProfileLink: "test",
                        } as UserDetailExtended
                    })
                })
            } else if(url.includes('chart/medications')){
                return new Promise((resolve) => {
                    resolve({
                        
                    })
                })
            } else {
                return new Promise((resolve) => {
                    resolve({
                        data: [{
                            stateCode: 'AL',
                            name: 'Alabama'
                        }]
                    })
                })
            }
        });
        await act(async () => {
            render(<TestWrapper mockState={mockState}>
                <UserDetails/>          
            </TestWrapper>);
        });
        expect(Api.get).toHaveBeenCalledTimes(5);
    });
})