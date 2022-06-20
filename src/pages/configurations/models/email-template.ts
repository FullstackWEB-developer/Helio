export interface EmailTemplate {
    id: string;
    subject: string;
    templateBody: string;
    layoutName: string;
    name: string;
    description: string;
    title: string;
    defaultBody: string;
    body: string;
    createdByName: string;
    createdOn: Date;
    modifiedByName?: string;
    modifiedOn?: Date;
}