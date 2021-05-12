export interface ContactNote {
    id?: string;
    noteText: string;
    createdOn: Date;
    createdByName: string;
    contactId: string;
}
export interface AddContactNoteProps {
    contactId: string;
    contactNoteDto: ContactNote
}