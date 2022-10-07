import {unmountComponentAtNode} from 'react-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React from 'react';
import i18n from '../../../i18nForTests';
import MockDate from 'mockdate';
import TestWrapper from '@shared/test-utils/test-wrapper';
import {act, render, screen} from '@testing-library/react';
import {VerifiedPatient} from '@pages/patients/models/verified-patient';
import {Provider} from '@shared/models';
import RequestRefill from '@pages/external-access/request-refill/request-refill';
import Api from '@shared/services/api';
import {Pharmacy} from '@pages/external-access/request-refill/models/pharmacy.model';
import {Medication} from '@pages/external-access/request-refill/models/medication.model';
describe("Request Refill tests", () => {

    let container: HTMLDivElement | null;
    const mockState = {
        externalAccessState: {
            requestRefillState: {
                refillRequestedMedicationNames: [
                    'Medication 1',
                    'Medication 2'
                ]
            }
        },
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
        jest.clearAllMocks();
    });


    it("renders Request Refill correctly", async () => {
        let fragment: any;
        jest.spyOn(Api, 'get').mockImplementation((url) => {
            if (url.includes('pharmacies/default')) {
                return new Promise((resolve) => {
                    resolve({
                        data: {
                            address1: 'address',
                            city: 'city',
                            phoneNumber: '2222222222',
                            state: 'AL',
                            zip: '55555',
                            clinicalProviderId: 3,
                            clinicalProviderName: 'bb',
                            faxNumber: '223232323'
                        } as Pharmacy
                    })
                })
            } else if(url.includes('chart/medications')){
                return new Promise((resolve) => {
                    resolve({
                        data: [{
                            unstructuredSig: '1 morning 1 night',
                            enteredBy: 'bbolek',
                            refillsAllowed: 3,
                            defaultProviderId: 3,
                            medicationName: 'Medication 1'
                        }] as Medication[]
                    })
                })
            } else {
                return new Promise((resolve) => {
                    resolve({
                        data: [{
                            stateCode: 'AL',
                            name: 'Alabama'
                        }]
                    })
                })
            }
        });
        await act(async () => {
            const {asFragment, findByText } = render(<TestWrapper mockState={mockState}>
                <RequestRefill/>
            </TestWrapper>)
            fragment = asFragment;
            expect(await findByText('external_access.medication_refill.back_to_medications')).not.toBeNull();
            expect(await findByText('external_access.medication_refill.refill_request')).not.toBeNull();
            expect(await screen.getByText('external_access.medication_refill.pharmacy_information_ph', {
                exact: false
            })).not.toBeNull();
        });
        expect(fragment()).toMatchSnapshot();
    });


    it("renders Request Refill correctly when there is no medications", async () => {
        let fragment: any;
        jest.spyOn(Api, 'get').mockImplementation((url) => {
            if (url.includes('pharmacies')) {
                return new Promise((resolve) => {
                    resolve({
                        data: [{
                            address1: 'address',
                            city: 'city',
                            phoneNumber: '2222222222',
                            state: 'AL',
                            zip: '55555',
                            clinicalProviderId: 3,
                            clinicalProviderName: 'bb',
                            faxNumber: '223232323'
                        }] as Pharmacy[]
                    })
                })
            } else {
                return new Promise((resolve) => {
                    resolve({
                        data: [{
                            stateCode: 'AL',
                            name: 'Alabama'
                        }]
                    })
                })
            }
        });
        await act(async () => {
            const {asFragment, findByText} = render(<TestWrapper mockState={mockState}>
                <RequestRefill/>
            </TestWrapper>)
            fragment = asFragment;
            expect(await findByText('request-refill.no_medication_found')).not.toBeNull();
        });
        expect(fragment()).toMatchSnapshot();
    });
});
