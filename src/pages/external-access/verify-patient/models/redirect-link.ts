import {ExternalAccessRequestTypes} from '@pages/external-access/models/external-updates-request-types.enum';
import {RequestChannel} from '@pages/external-access/verify-patient/models/request-channel.enum';

export interface RedirectLink {
    attributes: any;
    fullUrl: string;
    linkCreationDate: Date;
    linkId: string;
    patientId: string;
    requestChannel: RequestChannel;
    requestType: ExternalAccessRequestTypes;
    ticketId: string;
    sentAddress: string;
}
