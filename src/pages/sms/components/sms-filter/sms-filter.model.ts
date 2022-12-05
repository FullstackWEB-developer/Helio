export interface SmsFilterParamModel {
  assignedTo?: string;
  fromDate?: Date;
  toDate?: Date;
  timePeriod: string;
  unread?: boolean;
}
