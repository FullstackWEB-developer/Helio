import {ExternalAccessRequestTypes} from '@pages/external-access/models/external-updates-request-types.enum';

export interface RedirectLink {
    attributes: object,
    fullUrl: string,
    linkCreationDate: Date
    linkId: string
    patientId: string
    requestChannel: number
    requestType: ExternalAccessRequestTypes
    ticketId: string
}
