import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import CancellationReasonConfig from './cancellation-reason-config';
import { act } from 'react-dom/test-utils';
import Api from '@shared/services/api';
import { CancellationReasonExtended } from '@pages/configurations/models/CancellationReasonExtended';
import { CancellationReasonTypes } from '@pages/external-access/models/cancellation-reason-types.enum';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("CancellationReasonConfig tests", () => {
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

    it("renders CancellationReasonConfig correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <CancellationReasonConfig/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders CancellationReasonConfig with data correctly", async () => {
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
        jest.spyOn(Api, 'get').mockResolvedValue(response.data);
        await act(async () => {
            render(<TestWrapper mockState={mockState}>
                <CancellationReasonConfig/>
            </TestWrapper>);
        });
        expect(Api.get).toHaveBeenCalledTimes(2);
    });
})