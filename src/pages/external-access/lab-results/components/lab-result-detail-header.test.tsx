import {unmountComponentAtNode} from 'react-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React from 'react';
import i18n from '../../../../i18nForTests';
import MockDate from 'mockdate';
import LabResultDetailHeader from '@pages/external-access/lab-results/components/lab-result-detail-header';
import {LabResultDetail} from '@pages/external-access/lab-results/models/lab-result-detail.model';
import TestWrapper from '@shared/test-utils/test-wrapper';
import {render} from '@testing-library/react';
import {VerifiedPatient} from '@pages/patients/models/verified-patient';
describe("Lab Result Detail Header tests", () => {

    let container: HTMLDivElement | null;
    const mockState = {
        ticketState: {
            lookupValues: [],
            enumValues: [
                {
                    TicketType: []
                },
                {
                    TicketReason: []
                }
            ]
        },
        appUserState: {
            liveAgentStatuses: []
        },
        appState: {
            smsTemplates: [],
            emailTemplates: []
        },
        lookupsState: {
            providerList: []
        },
        patientsState: {
            verifiedPatient: {
                patientId: 3,
                firstName: 'Burak',
                lastName: 'BOLEK'
            } as VerifiedPatient
        }
    };
    const labResultDetail : LabResultDetail = {
        labResultId: 3,
        createdDateTime: dayjs('2018-04-04T16:00:00.000Z').toDate(),
        description: 'My Lab Result',
        encounterDate: dayjs('2018-04-04T16:00:00.000Z').toDate(),
        observationDate: dayjs('2018-04-04T16:00:00.000Z').toDate(),
        pages: [],
        observationDateTime: dayjs('2018-04-04T16:00:00.000Z').toDate(),
        observations: [],
        patientNote: 'patient Note',
        performingLabName: 'Lab name',
        providerId: 3
    }
    beforeEach(async () => {
        await i18n.init();
        MockDate.set(dayjs('2018-04-04T16:00:00.000Z').toDate());
        dayjs.extend(duration);
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        if (container) {
            unmountComponentAtNode(container);
            container.remove();
            container = null;
        }
        MockDate.reset();
    });

    it("renders Lab Result Detail Header correctly", async () => {
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <LabResultDetailHeader labResultDetail={labResultDetail}/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

});
