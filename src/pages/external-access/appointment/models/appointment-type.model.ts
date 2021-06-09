export interface AppointmentType {
    id: number;
    instructions: string;
    name: string;
    cancelable: boolean;
    cancelationTimeFrame?: number;
    cancelationFee?: number;
    reschedulable: boolean;
    rescheduleTimeFrame?: number;
}
