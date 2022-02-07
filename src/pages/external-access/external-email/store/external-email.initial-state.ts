import {EmailMessageDto} from '@shared/models';

export interface ExternalEmailState {
    emails: EmailMessageDto[];
    markAsRead: boolean;
}

const initialExternalEmailState: ExternalEmailState = {
    emails: [],
    markAsRead: false
}

export default initialExternalEmailState;
