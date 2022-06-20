import { useCallback } from 'react';
import { useParams } from 'react-router';
import AppointmentType from './components/appointment-type/appointment-type';
import ConfigurationsMenu from './components/configurations-menu/configurations-menu';
import CancellationReasonConfig from './components/cancellation-reason/cancellation-reason-config';
import TicketDepartment from './components/ticket-department/ticket-department';
import EditCancellationReason from './components/cancellation-reason/edit-cancellation-reason/edit-cancellation-reason';
import SMSTemplates from './components/sms-templates/sms-templates';
import SMSTemplateEdit from './components/sms-templates/sms-template-edit/sms-template-edit';
import TicketTags from './components/ticket-tags/ticket-tags';
import { AppointmentRemindersPath } from '@app/paths';
import AppointmentReminders from './components/appointment-reminders/appointment-reminders';
import { SMSTemplatesPath } from '@app/paths';
import ProviderAppointmentType from './components/provider-appointment-types/provider-appointment-types';
import { PublicLinksPath } from '@app/paths';
import PublicLinks from './components/public-links/public-links';
import ContactCategories from './components/contact-categories/contact-categories';
interface CancellationReasonParams {
    type: string,
    id: string
}
const Configurations = () => {
    const { type, id } = useParams<CancellationReasonParams>();
    const renderBodyByActiveRoute = useCallback(() => {
        switch (type) {
            case "cancellation-reasons":
                if (id) { return <EditCancellationReason /> }
                else { return <CancellationReasonConfig /> }
            case SMSTemplatesPath:
                if (id) { return <SMSTemplateEdit /> }
                else { return <SMSTemplates /> }
            case "ticket-department":
                return <TicketDepartment />
            case "appointment-type":
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
            default:
                return <AppointmentType />
        }
    }, [type, id]);
    return (
        <div className="flex w-full h-full overflow-y-auto">
            <ConfigurationsMenu activeUrl={type ? type : 'appointment-type'}></ConfigurationsMenu>
            {
                renderBodyByActiveRoute()
            }
        </div>
    );
}

export default Configurations;
