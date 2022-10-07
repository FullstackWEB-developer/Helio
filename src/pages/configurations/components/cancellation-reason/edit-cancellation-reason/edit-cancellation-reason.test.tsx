import i18n from '../../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import EditCancellationReason from './edit-cancellation-reason';
import Router from "react-router";
import { CancellationReasonTypes } from '@pages/external-access/models/cancellation-reason-types.enum';
import { CancellationReasonExtended } from '@pages/configurations/models/CancellationReasonExtended';
import Api from '@shared/services/api';
import { act } from 'react-dom/test-utils';
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useParams: jest.fn().mockReturnValue({ type: "ticket-department" }),
  }))
describe("EditCancellationReason tests", () => {
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

    it("renders EditCancellationReason correctly", async () => {
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: "123" })
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <EditCancellationReason/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders EditCancellationReason with data correctly", async () => {
        var response = {
            data: [{
                description: "string",
                existsOnEMR: true,
                id: 1,
                intentName: "string",
                isDefault: false,
                isMapped: false,
                name: "string",
                nameOnEMR: "string",
                type: CancellationReasonTypes.Cancel,
                createdByName: "string",
                createdOn: new Date(),
                modifiedByName: "string",
                modifiedOn: new Date()
            },{
                description: "string",
                existsOnEMR: true,
                id: 2,
                intentName: "string",
                isDefault: false,
                isMapped: false,
                name: "string",
                nameOnEMR: "string",
                type: CancellationReasonTypes.Cancel,
                createdByName: "string",
                createdOn: new Date(),
                modifiedByName: "string",
                modifiedOn: new Date()
            },{
                description: "string",
                existsOnEMR: true,
                id: 3,
                intentName: "string",
                isDefault: false,
                isMapped: false,
                name: "string",
                nameOnEMR: "string",
                type: CancellationReasonTypes.Cancel,
                createdByName: "string",
                createdOn: new Date(),
                modifiedByName: "string",
                modifiedOn: new Date()
            },{
                description: "string",
                existsOnEMR: true,
                id: 4,
                intentName: "string",
                isDefault: false,
                isMapped: false,
                name: "string",
                nameOnEMR: "string",
                type: CancellationReasonTypes.Cancel,
                createdByName: "string",
                createdOn: new Date(),
                modifiedByName: "string",
                modifiedOn: new Date()
            },{
                description: "string",
                existsOnEMR: true,
                id: 5,
                intentName: "string",
                isDefault: false,
                isMapped: false,
                name: "string",
                nameOnEMR: "string",
                type: CancellationReasonTypes.Cancel,
                createdByName: "string",
                createdOn: new Date(),
                modifiedByName: "string",
                modifiedOn: new Date()
            },{
                description: "string",
                existsOnEMR: true,
                id: 6,
                intentName: "string",
                isDefault: false,
                isMapped: false,
                name: "string",
                nameOnEMR: "string",
                type: CancellationReasonTypes.Cancel,
                createdByName: "string",
                createdOn: new Date(),
                modifiedByName: "string",
                modifiedOn: new Date()
            },{
                description: "string",
                existsOnEMR: true,
                id: 7,
                intentName: "string",
                isDefault: false,
                isMapped: false,
                name: "string",
                nameOnEMR: "string",
                type: CancellationReasonTypes.Cancel,
                createdByName: "string",
                createdOn: new Date(),
                modifiedByName: "string",
                modifiedOn: new Date()
            },{
                description: "string",
                existsOnEMR: true,
                id: 8,
                intentName: "string",
                isDefault: false,
                isMapped: false,
                name: "string",
                nameOnEMR: "string",
                type: CancellationReasonTypes.Cancel,
                createdByName: "string",
                createdOn: new Date(),
                modifiedByName: "string",
                modifiedOn: new Date()
            },{
                description: "string",
                existsOnEMR: true,
                id: 9,
                intentName: "string",
                isDefault: false,
                isMapped: false,
                name: "string",
                nameOnEMR: "string",
                type: CancellationReasonTypes.Cancel,
                createdByName: "string",
                createdOn: new Date(),
                modifiedByName: "string",
                modifiedOn: new Date()
            }] as CancellationReasonExtended[] 
        } as any
        jest.spyOn(Api, 'get').mockResolvedValue(response);
        jest.spyOn(Router, 'useParams').mockReturnValue({ id: "1" })
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <EditCancellationReason/>
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId('go-back-to-list'));
            });
        });
        expect(Api.get).toHaveBeenCalledTimes(1);
    });
})
