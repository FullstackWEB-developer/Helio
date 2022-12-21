import { DayOfWeek } from '@shared/models/DayOfWeek';

export enum WorkingHoursType {
  _24_7 = 1,
  Custom = 2,
}

export interface OperationSettingModel {
  id: number;
  timeZone: string;
  voiceRouting: boolean;
  autoReplySms: boolean;
  autoReplyEmail: boolean;
  routingNumber: string;
  workingHoursType: WorkingHoursType;
  workingHours: WorkingHourModel[];
  offDates: WorkingOffDateModel[];
}

export interface WorkingHourModel {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface WorkingOffDateModel {
  description: string;
  startDateTime: string;
  endDateTime: string;
}
