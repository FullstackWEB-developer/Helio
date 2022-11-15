import React, { Suspense, useCallback } from 'react';
import { useParams } from 'react-router';
import AppointmentType from './components/appointment-type/appointment-type';
import ConfigurationsMenu from './components/configurations-menu/configurations-menu';
import CancellationReasonConfig from './components/cancellation-reason/cancellation-reason-config';
import TicketDepartment from './components/ticket-department/ticket-department';
import EditCancellationReason from './components/cancellation-reason/edit-cancellation-reason/edit-cancellation-reason';
import SMSTemplates from './components/sms-templates/sms-templates';
import SMSTemplateEdit from './components/sms-templates/sms-template-edit/sms-template-edit';
import {AppointmentRemindersPath, PracticeEmailTemplatePath, SecuritySettingsPath} from '@app/paths';
import TicketTags from './components/ticket-tags/ticket-tags';
import AppointmentReminders from './components/appointment-reminders/appointment-reminders';
import { SMSTemplatesPath } from '@app/paths';
import ProviderAppointmentType from './components/provider-appointment-types/provider-appointment-types';
import { PublicLinksPath } from '@app/paths';
import PublicLinks from './components/public-links/public-links';
import ContactCategories from './components/contact-categories/contact-categories';
import EmailNotificationDetails from './components/email-notification-templates/email-notification-details';
import EmailNotificationList from './components/email-notification-templates/email-notification-list'
import { PracticeBrandingPath } from '@app/paths';
import SecuritySettings from './components/security-settings/security-settings';
import EditAppointmentType from './components/appointment-type/edit-appointment-type/edit-appointment-type'
import GeneralSettings from './components/general-settings/general-settings';
import PracticeEmailTemplateEdit from "@pages/configurations/components/branding/practice-email-template/practice-email-template";
import PatientChartTabs from '@pages/configurations/components/patient-chart-tabs/patient-chart-tabs';
import SvgIcon, { Icon } from '@components/svg-icon';
import WebChat from './components/web-chat/web-chat';
const PracticeBrandingEdit = React.lazy(() => import("./components/branding/practice-branding/practice-branding"));
interface ConfigurationUrlParams {
    type: string,
    id: string
}
const spinner = (
    <div className='flex flex-col space-y-4 items-center h-full w-full justify-center'>
        <SvgIcon type={Icon.Spinner} className={`icon-large-40`}/>
    </div>
)
const Configurations = () => {
    const { type, id } = useParams<ConfigurationUrlParams>();
    const renderBodyByActiveRoute = useCallback(() => {
        switch (type) {
            case "cancelation-reasons":
                if (id) {return <EditCancellationReason />}
                else {return <CancellationReasonConfig />}
            case SMSTemplatesPath:
                if (id) { return <SMSTemplateEdit /> }
                else { return <SMSTemplates /> }
            case "ticket-department":
                return <TicketDepartment />
            case "appointment-type":
                if (id) { return <EditAppointmentType /> }
                return <AppointmentType />
            case "ticket-tags":
                return <TicketTags />
            case AppointmentRemindersPath:
                return <AppointmentReminders />
            case "provider-appointment-settings":
                return <ProviderAppointmentType />
            case PublicLinksPath:
                return <PublicLinks />
            case "contact-categories":
                return <ContactCategories />
            case SecuritySettingsPath:
                return <SecuritySettings />
            case PracticeBrandingPath:
                return <Suspense fallback={spinner}>
                    <PracticeBrandingEdit />
                </Suspense>
            case "email-templates":
                if (id) { return <EmailNotificationDetails /> }
                return <EmailNotificationList />;
            case "general":
                return <GeneralSettings />;
            case "patient-tabs":
                return <PatientChartTabs />;
            case PracticeEmailTemplatePath:
                return <PracticeEmailTemplateEdit />;
            case "chat-widget":
                return <WebChat />;
            default:
                return <GeneralSettings />
        }
    }, [type, id]);
    return (
        <div className="flex w-full h-full overflow-y-auto">
            <ConfigurationsMenu activeUrl={type ? type : 'general'}></ConfigurationsMenu>
            {
                renderBodyByActiveRoute()
            }
        </div>
    );
}

export default Configurations;
