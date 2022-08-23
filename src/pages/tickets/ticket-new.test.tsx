import i18n from '../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {act, render} from '@testing-library/react';
import React from 'react'
import TestWrapper from '@shared/test-utils/test-wrapper';
import TicketNew from '@pages/tickets/ticket-new';
import {User} from '@shared/models';

describe("Ticket New tests", () => {
    let container: HTMLDivElement | null;
    let mockState = {
        ticketState: {
            lookupValues: []
        },
        appUserState: {
            liveAgentStatuses: []
        },
        lookupsState: {
            userList: [ {
                lastName: 'test',
                firstName:'last',
                id:'123',
                email:'asdasd@asdas.com',
                latestConnectStatus: 'Available',
                profilePicture: 'test'
            }] as User[],
            locationList: [ {
                medicationHistoryConsent: false,
                timeZoneOffset: 'test',
                isHospitalDepartment: false,
                state: 'test',
                portalUrl: 'test',
                city: 'test',
                placeOfServiceFacility: false,
                serviceDepartment: false,
                latitude: 123,
                fax: 'test',
                doesNotObservedSt: false,
                id: 123,
                address: 'test',
                placeOfServiceTypeId: 123,
                longitude: 123,
                clinicals: 'test',
                timeZone: 'test',
                patientDepartmentName: 'test',
                chartSharingGroupId: 'test',
                name: 'test',
                placeOfServiceTypeName: 'test',
                phone: 'test',
                clinicalProviderFax: 'test',
                ecommerceCreditCardTypes: [],
                zip: 'test',
                timeZoneName: 'test'
            }]
        },
        contactState : {
            contacts: []
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

    it("renders new-ticket correctly", async () => {
        let fragment;
        act(() => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <TicketNew/>
            </TestWrapper>);
            fragment = asFragment();
        });
        expect(fragment).toMatchSnapshot();
    });
})
