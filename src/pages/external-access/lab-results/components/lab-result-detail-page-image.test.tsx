import {unmountComponentAtNode} from 'react-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React from 'react';
import i18n from '../../../../i18nForTests';
import MockDate from 'mockdate';
import TestWrapper from '@shared/test-utils/test-wrapper';
import {render} from '@testing-library/react';
import {VerifiedPatient} from '@pages/patients/models/verified-patient';
import LabResultDetailPageImage from '@pages/external-access/lab-results/components/lab-result-detail-page-image';
import {LabResultDetailPage} from '@pages/external-access/lab-results/models/lab-result-detail-page.model';
import Api from '@shared/services/api';
describe("Lab Result Detail Page Image tests", () => {

    let container: HTMLDivElement | null;
    let mockState = {
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
    const labResultDetailPage : LabResultDetailPage = {
        contentType: 'txt',
        href:'sd',
        pageId:1,
        pageOrdering:'s'
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

    it("renders Lab Result Detail Page Image correctly", async () => {
        jest.spyOn(Api, 'get').mockResolvedValue({
            content: 'content',
            contentType :'xml'
        });
        const {asFragment} = render(<TestWrapper mockState={mockState}>
            <LabResultDetailPageImage page={labResultDetailPage}  labResultId={1}/>
        </TestWrapper>);
        expect(asFragment()).toMatchSnapshot();
    });

});
