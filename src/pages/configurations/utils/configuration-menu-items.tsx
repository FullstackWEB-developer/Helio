import { AppointmentRemindersPath } from "@app/paths";
import { SMSTemplatesPath } from "@app/paths";
import { PublicLinksPath } from "@app/paths";

export const ConfigurationMenuItems = [{
    id: "configuration-menu-item-0",
    title: 'configuration.appointments',
    children: [{
        id: "configuration-menu-item-1",
        title: 'configuration.appointment_type',
        url: "appointment-type",
    }, {
        id: "configuration-menu-item-2",
        title: 'configuration.appointment_cancellation',
        url: "cancellation-reasons",
    }]
}, {
    id: "configuration-menu-item-3",
    title: 'configuration.notifications',
    children: [{
        id: "configuration-menu-item-4",
        title: 'configuration.appointment_reminder',
        url: AppointmentRemindersPath,
    }, {
        id: "configuration-menu-item-5",
        title: 'configuration.email_templates',
        url: "email-templates"
    }, {
        id: "configuration-menu-item-6",
        title: 'configuration.sms_notification_templates',
        url: SMSTemplatesPath,
    }]
},
{
    id: "configuration-menu-item-4",
    title: 'configuration.appointment_types_for_providers.menu_name',
    url: 'provider-appointment-settings'
}, {
    id: "configuration-menu-item-7",
    title: 'configuration.tickets',
    children: [{
        id: "configuration-menu-item-8",
        title: 'configuration.ticket_department_menu',
        url: "ticket-department",
    }]
},
{
    id: "configuration-menu-item-9",
    title: 'configuration.call_center',
    url: "call-center",
},
{
    id: "configuration-menu-item-10",
    title: 'configuration.contact_categories_menu',
    url: "contact-categories",
}, {
    id: "configuration-menu-item-11",
    title: 'configuration.security',
    url: "security",
}, {
    id: "configuration-menu-item-12",
    title: 'configuration.general',
    url: "general",
},{
    id: "configuration-menu-item-13",
    title: 'configuration.tags',
    url: "ticket-tags"
}, {
    id: "configuration-menu-item-14",
    title: 'configuration.public_links_menu',
    url: PublicLinksPath
}
];
