import {Dispatch} from "@reduxjs/toolkit";
import Api from "../../../../shared/services/api";
import {endOpenSlotsRequest, endRescheduleAppointment, setOpenSlots, setRescheduledAppointment, startOpenSlotsRequest, startRescheduleAppointment } from "../store/reschedule-appointment.slice";
import Logger from "../../../../shared/services/logger";
import utils from "../../../../shared/utils/utils";
const logger = Logger.getInstance();

export const getOpenSlots = (providerId: string, departmentId: string, appointmentTypeId: string, startDate: Date, endDate: Date) => {
    let getOpenSlotsUrl = `/appointments/open-slots?ignoreschedulablepermission=true&departmentId=${departmentId}&providerId=${providerId}&appointmentTypeId=${appointmentTypeId}&startDate=${utils.dateToString(startDate, 'yyyy-MM-dd')}&endDate=${utils.dateToString(endDate, 'yyyy-MM-dd')}`;
    return async (dispatch: Dispatch) => {
        dispatch(startOpenSlotsRequest());
        await Api.get(getOpenSlotsUrl)
            .then(response => {
                dispatch(setOpenSlots(response.data));
            })
            .catch(error => {
                logger.error('Failed getting open slots', error);
                dispatch(endOpenSlotsRequest('common.error'));
            })
    }
}

export const rescheduleAppointment = (appointmentId: string, newAppointmentId: number, patientId: number) => {
    let getOpenSlotsUrl = `/appointments/${appointmentId}/reschedule`;
    return async (dispatch: Dispatch) => {
        dispatch(startRescheduleAppointment());
        await Api.put(getOpenSlotsUrl, {
            patientId,
            newAppointmentId
        })
            .then(response => {
                dispatch(setRescheduledAppointment(response.data));
            })
            .catch(error => {
                logger.error('Failed rescheduling appointment', error);
                if (error?.response?.data?.message) {
                    dispatch(endRescheduleAppointment(error?.response?.data?.message));
                } else {
                    dispatch(endRescheduleAppointment('common.error'));
                }
            })
    }
}