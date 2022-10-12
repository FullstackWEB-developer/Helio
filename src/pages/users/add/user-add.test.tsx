import i18n from '../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, wait, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import UserAdd from './user-add';
import { act } from 'react-dom/test-utils';
import Router from "react-router";
import Api from '@shared/services/api';
import { PagedList, UserActiveDirectory } from '@shared/models';
jest.setTimeout(30000);
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
describe("UserAdd tests", () => {
    
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

    it("renders UserAdd correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <UserAdd/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders UserAdd with data correctly", async () => {
        jest.spyOn(Api, 'post').mockImplementation(() => {
            return new Promise((resolve) => {
                resolve({})
            })
        });
        jest.spyOn(Api, 'get').mockImplementation((url) => {
            if (url.includes('external-users')) {
                return new Promise((resolve) => {
                    resolve({
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
                                }
                            ]
                    } as PagedList<UserActiveDirectory>
                    })
                })
            }else {
                return new Promise((resolve) => {
                    resolve({})
                })
            }
        });
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <UserAdd/>
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId('email'));
                fireEvent.input(getByTestId('users.add_section.personalize_message_placeholder'), { target: {value: "Test"}});
                fireEvent.input(getByTestId('email'), { target: {value: "Test"}});
                setTimeout(() => {}, 5000);
                fireEvent.change(getByTestId('role'), { target: {value: "string0"}});
                fireEvent.click(getByTestId('add-user'));
                fireEvent.click(getByTestId('users.add_section.add_button'));
                
            });
        });
        expect(Api.get).toHaveBeenCalledTimes(2);
        expect(Api.post).toHaveBeenCalledTimes(0);
    });
})