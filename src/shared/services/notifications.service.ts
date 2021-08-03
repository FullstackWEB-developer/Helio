import Api from './api';
import {NotificationTemplate, NotificationTemplateChannel} from '@shared/models/notification-template.model';
import {Contact} from '@shared/models';
import {Patient} from '@pages/patients/models/patient';
import {Ticket} from '@pages/tickets/models/ticket';

const contactsUrl = '/notifications';

export const getTemplates = async (channel: NotificationTemplateChannel, category?: string): Promise<NotificationTemplate[]> => {
    const result = await Api.get(`${contactsUrl}/templates`, {
        params: {
            channel,
            category
        }
    });
    return result.data;
}

export const processTemplate = async (templateId: string, ticket: Ticket, patient?: Patient, contact?: Contact): Promise<NotificationTemplate> => {
    const url = `${contactsUrl}/templates/${templateId}/process`;
    let data = {
        ticket,
        contact,
        patient
    }
    const result = await Api.post(url, JSON.stringify(data), {
        headers: {
            'Content-Type':'application/json'
        }
    });
    return result.data;
}
