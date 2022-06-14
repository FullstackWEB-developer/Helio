import Api from './api';
import { AppointmentTypesForProviderUpdateRequest } from '@shared/models/appointment-type-for-provider-update-request';
import { NotificationTemplate, NotificationTemplateChannel } from '@shared/models/notification-template.model';
import { Contact, ContactExtended } from '@shared/models';
import { Patient } from '@pages/patients/models/patient';
import { Ticket } from '@pages/tickets/models/ticket';
import { TemplateUsedFrom } from '@components/notification-template-select/template-used-from';
import { SMSTemplate } from '@pages/configurations/models/sms-templates';
import { AppointmentTypeForProvider } from '@shared/models/appointment-type-for-provider';

const notificationsUrl = '/notifications';

export const getTemplates = async (channel: NotificationTemplateChannel, usedFrom: TemplateUsedFrom, category?: string): Promise<NotificationTemplate[]> => {
    const result = await Api.get(`${notificationsUrl}/templates`, {
        params: {
            channel,
            category,
            usedFrom
        }
    });
    return result.data;
}

export const processTemplate = async (templateId: string, ticket: Ticket, patient?: Patient, contact?: Contact | ContactExtended): Promise<NotificationTemplate> => {
    const url = `${notificationsUrl}/templates/${templateId}/process`;
    let data = {
        ticket,
        contact,
        patient
    }
    const result = await Api.post(url, JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return result.data;
}

export const getRedirectLink = async (linkId: string) => {
    const url = `${notificationsUrl}/${linkId}`;
    const response = await Api.get(url);
    return response.data;
}
export const getAppointmentTypesForProvider = async (providerId: number) => {
    const url = `appointments/appointmenttypes/provider/${providerId}`;
    const response = await Api.get<AppointmentTypeForProvider[]>(url);
    return response.data;
}
export const saveAppointmentTypesForProvider = async (payload: AppointmentTypesForProviderUpdateRequest) => {
    const url = `appointments/appointmenttypes/provider`;
    await Api.post(url, payload);
}
export const getSMSTemplates = async () => {
    const url = `${notificationsUrl}/admin/sms-templates`;
    const result = await Api.get<SMSTemplate[]>(url);
    return result.data;
}
