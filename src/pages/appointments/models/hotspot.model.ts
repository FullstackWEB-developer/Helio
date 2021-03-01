export interface HotSpotInfo {
    date: Date;
    details: HotSpotDetail[]
}

export interface HotSpotDetail {
    providerId: number;
    departmentId: number;
    count: number;
}