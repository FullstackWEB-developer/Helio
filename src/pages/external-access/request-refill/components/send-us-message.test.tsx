import {unmountComponentAtNode} from 'react-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React from 'react';
import i18n from '../../../../i18nForTests';
import MockDate from 'mockdate';
import TestWrapper from '@shared/test-utils/test-wrapper';
import {act, fireEvent, render, screen} from '@testing-library/react';
import SendUsMessage from '@pages/external-access/request-refill/components/send-us-message';
import {VerifiedPatient} from '@pages/patients/models/verified-patient';
import {Provider} from '@shared/models';
describe("Request Refill Send Us Message tests", () => {

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


    it("renders Request Refill Send Us Message correctly", async () => {
        let fragment: any;
        await act(async () => {
            const {asFragment, findByText} = render(<TestWrapper mockState={mockState}>
                <SendUsMessage/>
            </TestWrapper>)
            fragment = asFragment;
            expect(await findByText('external_access.medication_refill.have_questions')).not.toBeNull();
            expect(await findByText('external_access.send_us_message')).not.toBeNull();
            fireEvent.click(await screen.findByText('external_access.send_us_message'));
            expect(await findByText('external_access.medication_refill.message_your_provider')).not.toBeNull();
            expect(await findByText('common.send')).not.toBeNull();
        });
        expect(fragment()).toMatchSnapshot();
    });
});
