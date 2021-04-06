export interface AppointmentNoteInfo {
    appointmentId: number;
    notes: AppointmentNote[]
}

export interface AppointmentNote {
    noteId: number;
    noteText: string;
}
