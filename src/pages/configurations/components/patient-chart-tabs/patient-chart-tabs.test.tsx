import i18n from '../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render, waitFor} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import PatientChartTabs from './patient-chart-tabs';
import Api from '@shared/services/api';
import { act } from 'react-dom/test-utils';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("PatientChartTabs tests", () => {
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

    it("renders PatientChartTabs correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <PatientChartTabs/>          
            </TestWrapper>);
            fragment = asFragment;
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders PatientChartTabs with id correctly", async () => {
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
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <PatientChartTabs/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId('appointments'), {target: {checked: false}});
                fireEvent.click(getByTestId('insurance'), {target: {checked: false}});
                fireEvent.click(getByTestId('patientCases'), {target: {checked: false}});
                fireEvent.click(getByTestId('medications'), {target: {checked: false}});
                fireEvent.click(getByTestId('testResults'), {target: {checked: false}});
                fireEvent.click(getByTestId('submit'));
            });
        });
        
        expect(Api.get).toHaveBeenCalledTimes(1);
    });

    it("renders PatientChartTabs with reset correctly", async () => {
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
        await act(async () => {
            const {getByTestId} = render(<TestWrapper mockState={mockState}>
                <PatientChartTabs/>          
            </TestWrapper>);
            await waitFor(() => {
                fireEvent.click(getByTestId('appointments'), {target: {checked: false}});
                fireEvent.click(getByTestId('insurance'), {target: {checked: false}});
                fireEvent.click(getByTestId('patientCases'), {target: {checked: false}});
                fireEvent.click(getByTestId('medications'), {target: {checked: false}});
                fireEvent.click(getByTestId('testResults'), {target: {checked: false}});
                fireEvent.click(getByTestId('reset'));
            });
        });
        
        expect(Api.get).toHaveBeenCalledTimes(1);
    });
})
