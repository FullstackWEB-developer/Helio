import Api from './api';
import {AppointmentTypesForProviderUpdateRequest} from '@shared/models/appointment-type-for-provider-update-request';
import {NotificationTemplate, NotificationTemplateChannel} from '@shared/models/notification-template.model';
import {Contact, ContactExtended} from '@shared/models';
import {Patient} from '@pages/patients/models/patient';
import {Ticket} from '@pages/tickets/models/ticket';
import {TemplateUsedFrom} from '@components/notification-template-select/template-used-from';
import {SMSTemplate} from '@pages/configurations/models/sms-templates';
import {SMSTemplateUpdate} from '@pages/configurations/models/sms-template-update';
import {AppointmentTypeForProvider} from '@shared/models/appointment-type-for-provider';
import {EmailTemplatePreviewRequest} from '@shared/models/email-template-preview-request';
import {EmailTemplateUpdateRequest} from '@shared/models/email-template-update-request';
import {PracticeEmailTemplate} from "@pages/configurations/models/practice-email-template";
import {
    PracticeEmailTemplatePreviewFromBranding
} from "@pages/configurations/models/practice-email-template-preview-from-branding";

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
export const getSMSTemplateById = async (id: string) => {
    const url = `${notificationsUrl}/admin/sms-templates/${id}`;
    const result = await Api.get<SMSTemplate>(url);
    return result.data;
}
export const updateSMSTemplate = async (payload: SMSTemplateUpdate) => {
    const url = `${notificationsUrl}/admin/sms-templates`;
    await Api.post(url, payload);
}
export const getEmailNotificationList = async () => {
    const url = `${notificationsUrl}/admin/practice-email-templates`;
    const {data} = await Api.get(url);
    return data;
}

export const getEmailTemplatePreview = async (payload: EmailTemplatePreviewRequest) => {
    const url = `${notificationsUrl}/admin/email-templates/preview`;
    const {data} = await Api.post(url, payload);
    return data;
}

export const getPracticeEmailTemplatePreview = async (payload: PracticeEmailTemplate) => {
    const url = `${notificationsUrl}/admin/practice-email-template/preview`;
    const {data} = await Api.post(url, payload);
    return data;
}

export const getPracticeEmailTemplatePreviewFromBranding = async (payload: PracticeEmailTemplatePreviewFromBranding) => {
    const url = `${notificationsUrl}/admin/practice-email-template/preview-from-branding`;
    const {data} = await Api.post(url, payload);
    return data;
}

export const updateEmailTemplate = async (payload: {body: EmailTemplateUpdateRequest, id: string}) => {
    const url = `${notificationsUrl}/admin/email-templates/${payload.id}`;
    const {data} = await Api.put(url, payload.body);
    return data;
}

export const getEmailTemplateById = async(id: string) => {
    const url = `${notificationsUrl}/admin/email-templates/${id}`;
    const {data} = await Api.get(url);
    return data;
}

export const getPracticeEmailTemplate = async() => {
    const url = `${notificationsUrl}/admin/practice-email-template`;
    const {data} = await Api.get<PracticeEmailTemplate>(url);
    return data;
}
export const savePracticeEmailTemplate = async(payload: PracticeEmailTemplate) => {
    const url = `${notificationsUrl}/admin/practice-email-template`;
    const {data} = await Api.put<PracticeEmailTemplate>(url, payload);
    return data;
}