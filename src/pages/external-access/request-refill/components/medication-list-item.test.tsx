import {unmountComponentAtNode} from 'react-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React from 'react';
import i18n from '../../../../i18nForTests';
import MockDate from 'mockdate';
import TestWrapper from '@shared/test-utils/test-wrapper';
import {act, render} from '@testing-library/react';
import MedicationListItem from '@pages/external-access/request-refill/components/medication-list-item';
import {Medication} from '@pages/external-access/request-refill/models/medication.model';
describe("Medication List Item tests", () => {

    let container: HTMLDivElement | null;
    const mockState = {
        externalAccessState: {
            requestRefillState: {
                refillRequestedMedicationNames: [
                    'Medication 1',
                    'Medication 2'
                ]
            }
        }
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


    it("renders Medication List Item with no refills correctly", async () => {
        const medication: Medication = {
            medicationName: 'Medication 3',
            defaultProviderId: 3,
            enteredBy: 'bbolek',
            refillsAllowed: 0,
            unstructuredSig: ''
        }
        let fragment: any;
        await act(async () => {
            const {asFragment, findByText} = render(<TestWrapper mockState={mockState}>
                <MedicationListItem data={medication}/>
            </TestWrapper>)
            fragment = asFragment;
            expect(await findByText('external_access.medication_refill.medication_list.refill_not_available')).not.toBeNull();
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders Medication List Item with refills correctly", async () => {
        const medication: Medication = {
            medicationName: 'Medication 3',
            defaultProviderId: 3,
            enteredBy: 'bbolek',
            refillsAllowed: 3,
            unstructuredSig: ''
        }
        let fragment: any;
        await act(async () => {
            const {asFragment, findByText} = render(<TestWrapper mockState={mockState}>
                <MedicationListItem data={medication}/>
            </TestWrapper>)
            fragment = asFragment;
            expect(await findByText('external_access.medication_refill.medication_list.request_refill')).not.toBeNull();
        });
        expect(fragment()).toMatchSnapshot();
    });

    it("renders Medication List Item with refills correctly when refill requested", async () => {
        const medication: Medication = {
            medicationName: 'Medication 1',
            defaultProviderId: 3,
            enteredBy: 'bbolek',
            refillsAllowed: 3,
            unstructuredSig: ''
        }
        let fragment: any;
        await act(async () => {
            const {asFragment, findByText} = render(<TestWrapper mockState={mockState}>
                <MedicationListItem data={medication}/>
            </TestWrapper>)
            fragment = asFragment;
            expect(await findByText('external_access.medication_refill.medication_list.refill_requested')).not.toBeNull();
        });
        expect(fragment()).toMatchSnapshot();
    });

});
