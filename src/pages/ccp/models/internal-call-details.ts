export interface InternalCallDetails {
    type: string,
    queueArn: string;
    fromUserId: string;
    toUserId: string;
    diallingUserFullname?: string;
}
