import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, wait, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import BulkAdd from './bulk-add';
import { act } from 'react-dom/test-utils';
import Router from "react-router";
import Api from '@shared/services/api';
import { ExternalUser, InviteUserModel, PagedList, SelectExternalUser, UserActiveDirectory } from '@shared/models';
jest.setTimeout(30000);
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
describe("BulkAdd tests", () => {
    
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

    it("renders BulkAdd correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <BulkAdd/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders BulkAdd correctly with data", async () => {
        var response = {
            data: {
                page: 1,
                pageSize: 10,
                totalPages: 1,
                totalCount: 1,
                results: [
                    {
                        azureId: "190981e5-df9a-44b8-b534-da788eba29a3",
                        displayName: "Test",
                        description: "Empty",
                        mail: "test@gmail.com",
                    },{
                        azureId: "190981e5-df9a-44b8-b534-da788eba29b3",
                        displayName: "Test",
                        description: "Empty",
                        mail: "test@gmail.com",
                    }
                ]
            } as PagedList<UserActiveDirectory>
        } as any
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        jest.spyOn(Api, 'post').mockResolvedValue(null);
        await act(async () => {
            const {getByTestId} =render(<TestWrapper mockState={mockState}>
                <BulkAdd/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId('external-user-0'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('deselect'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('external-user-0'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('continue'));
            });
            await waitFor(() => {
                fireEvent.change(getByTestId("users.bulk_section.pick_a_role"), {
                    target: {
                        value: "string0"
                    }
                });
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('continue'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('continue'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('back'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('continue'));
            });
            await waitFor(() => {
                fireEvent.input(getByTestId("personal-message"), {
                    target: {
                        value: "string0"
                    }
                });
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('continue'));
            });
            await new Promise((r) => setTimeout(r, 5000));
        });
        expect(Api.get).toHaveBeenCalledTimes(7);
        expect(Api.post).toHaveBeenCalledTimes(1);
    });
    it("renders BulkAdd correctly with data error", async () => {
        var response = {
            data: {
                page: 1,
                pageSize: 10,
                totalPages: 1,
                totalCount: 1,
                results: [
                    {
                        azureId: "190981e5-df9a-44b8-b534-da788eba29a3",
                        displayName: "Test",
                        description: "Empty",
                        mail: "test@gmail.com",
                    },{
                        azureId: "190981e5-df9a-44b8-b534-da788eba29b3",
                        displayName: "Test",
                        description: "Empty",
                        mail: "test@gmail.com",
                    }
                ]
            } as PagedList<UserActiveDirectory>
        } as any
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        jest.spyOn(Api, 'post').mockImplementation(() => {
            return Promise.reject({statusCode: 404});
        });
        await act(async () => {
            const {getByTestId} =render(<TestWrapper mockState={mockState}>
                <BulkAdd/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId('external-user-0'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('deselect'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('external-user-0'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('continue'));
            });
            await waitFor(() => {
                fireEvent.change(getByTestId("users.bulk_section.pick_a_role"), {
                    target: {
                        value: "string0"
                    }
                });
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('continue'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('continue'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('back'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('continue'));
            });
            await waitFor(() => {
                fireEvent.input(getByTestId("personal-message"), {
                    target: {
                        value: "string0"
                    }
                });
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('continue'));
            });
            await new Promise((r) => setTimeout(r, 5000));
        });
        expect(Api.get).toHaveBeenCalledTimes(7);
        expect(Api.post).toHaveBeenCalledTimes(1);
    });

    it("renders BulkAdd correctly with data without roles", async () => {
        var response = {
            data: {
                page: 1,
                pageSize: 1,
                totalPages: 2,
                totalCount: 2,
                results: [
                    {
                        azureId: "190981e5-df9a-44b8-b534-da788eba29a3",
                        displayName: "Test",
                        description: "Empty",
                        mail: "test@gmail.com",
                    },{
                        azureId: "190981e5-df9a-44b8-b534-da788eba29b3",
                        displayName: "Test",
                        description: "Empty",
                        mail: "test@gmail.com",
                    }
                ]
            } as PagedList<UserActiveDirectory>
        } as any
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        mockState.usersState.selectedExternalUsers[0].inviteUserModel.roles = undefined;
        await act(async () => {
            const {getByTestId} =render(<TestWrapper mockState={mockState}>
                <BulkAdd/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId('external-user-0'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('continue'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('continue'));
            });
            await waitFor(() => {
                fireEvent.click(getByTestId('back'));
            });
        });
        expect(Api.get).toHaveBeenCalledTimes(7);
    });
})