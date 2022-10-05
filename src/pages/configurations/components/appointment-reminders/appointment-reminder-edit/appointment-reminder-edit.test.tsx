import i18n from '../../../../../i18nForTests';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {unmountComponentAtNode} from 'react-dom';
import {fireEvent, render} from '@testing-library/react';
import TestWrapper from '@shared/test-utils/test-wrapper';
import AppointmentReminderEdit from './appointment-reminder-edit';
import EmailProvider from '@pages/email/context/email-context';
import { useForm } from 'react-hook-form';
import { act } from 'react-dom/test-utils';
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
   }));
describe("AppointmentReminderEdit tests", () => {
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

    it('renders AppointmentReminderEdit correctly', async () => {
        let fragment: any;
        
        const Component = () => {
          const { control } = useForm<{ test: string }>();
          return <AppointmentReminderEdit index={1} control={control} availableDays={[{value: "1", label: "1"},{value: "2", label: "2"}]} onSelect={() => {}} onRemove={() => {}}/>;
        };
        
        await act(async () => {
            const {asFragment} = render(<TestWrapper mockState={mockState}>
                <Component />
            </TestWrapper>);
            fragment = asFragment;
        });
        
        expect(fragment()).toMatchSnapshot();
      });
})