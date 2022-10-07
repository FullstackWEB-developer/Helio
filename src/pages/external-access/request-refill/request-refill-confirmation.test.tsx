import {unmountComponentAtNode} from 'react-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React from 'react';
import i18n from '../../../i18nForTests';
import MockDate from 'mockdate';
import TestWrapper from '@shared/test-utils/test-wrapper';
import {act, render} from '@testing-library/react';
import {VerifiedPatient} from '@pages/patients/models/verified-patient';
import {Provider} from '@shared/models';
import RequestRefillConfirmation from '@pages/external-access/request-refill/request-refill-confirmation';
describe("Request Refill Confirmation tests", () => {

    let container: HTMLDivElement | null;
    const mockState = {
        patientsState: {
            verifiedPatient: {
                patientId: 3,
                firstName: 'Burak',
                lastName: 'BOLEK',
                departmentId: 3
            } as VerifiedPatient
        },
        lookupsState: {
            providerList: [
                {
                    ansiNameCode: '',
                    ansiSpecialtyCode: '',
                    billable: false,
                    createEncounterOnCheckin: false,
                    firstName: 'provider',
                    lastName: 'lastname',
                    id: 3
                }
            ] as Provider[]
        },
    };
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


    it("renders Request Refill Confirmation correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment, findByText} = render(<TestWrapper mockState={mockState}>
                <RequestRefillConfirmation/>
            </TestWrapper>)
            fragment = asFragment;
            expect(await findByText('external_access.medication_refill.back_to_medications')).not.toBeNull();
            expect(await findByText('external_access.medication_refill.refill_request_sent')).not.toBeNull();
            expect(await findByText('external_access.medication_refill.refill_request_sent_details')).not.toBeNull();
            await new Promise((r) => setTimeout(r, 2600));
            //Hipaa dialog is displayed after 2.5 seconds
            expect(await findByText('common.close_window_title')).not.toBeNull();
        });
        expect(fragment()).toMatchSnapshot();
    });
});
