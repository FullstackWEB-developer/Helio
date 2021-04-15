export interface AppointmentType {
    id: number;
    instructions: string;
    cancelable: boolean;
    cancelationTimeFrame?: number;
    cancelationFee?: number;
    reschedulable: boolean;
    rescheduleTimeFrame?: number;
}
