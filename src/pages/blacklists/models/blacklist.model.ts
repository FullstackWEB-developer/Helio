import {Paging} from '@shared/models/paging.model';

export interface BlacklistModel {
    id: string;
    accessType: BlockAccessType;
    value: string;
    comment: string;
    createdOn: string;
    createdByName: string;
    isActive: boolean;
}

export interface BlockAccessModel {
    accessType: BlockAccessType;
    value: string;
    comment: string;
    isActive: boolean;
}
export enum BlockAccessType {
    Phone = 1,
    Email = 2,
    IPAddress = 3
}

export interface BlacklistRequest extends Paging {
    accessType: BlockAccessType
    value?: string;
}
