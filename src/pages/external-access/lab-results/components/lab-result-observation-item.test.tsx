import {unmountComponentAtNode} from 'react-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React from 'react';
import i18n from '../../../../i18nForTests';
import MockDate from 'mockdate';
import TestWrapper from '@shared/test-utils/test-wrapper';
import {render} from '@testing-library/react';
import {VerifiedPatient} from '@pages/patients/models/verified-patient';
import Api from '@shared/services/api';
import LabResultObservationItem from '@pages/external-access/lab-results/components/lab-result-observation-item';
import {LabResultObservation} from '@pages/external-access/lab-results/models/lab-result-observation.model';
describe("Lab Result Observation Item tests", () => {

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
    const observation : LabResultObservation = {
        abnormalFlag: 'false',
        analyteId:3,
        resultStatus:'true',
        analyteName:'name',
        loinc:'asd',
        note: 'note',
        observationIdentifier: 'id',
        units: 'day',
        value: '3',
        referenceRange: '3-10'
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

    it("renders Lab Result Observation Item correctly", async () => {
        jest.spyOn(Api, 'get').mockResolvedValue({
            content: 'content',
            contentType :'xml'
        });
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <LabResultObservationItem observation={observation} />
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

});
