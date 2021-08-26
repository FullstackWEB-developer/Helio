import {ExternalAccessRequestTypes} from '@pages/external-access/models/external-updates-request-types.enum';
import {RequestChannel} from '@pages/external-access/hipaa-verification/models/request-channel.enum';

export interface RedirectLink {
    attributes: object,
    fullUrl: string,
    linkCreationDate: Date
    linkId: string
    patientId: string
    requestChannel: RequestChannel
    requestType: ExternalAccessRequestTypes
    ticketId: string
}
