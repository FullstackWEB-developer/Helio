import { Dispatch } from '@reduxjs/toolkit';
import Api from '../../../../shared/services/api';
import { endOpenSlotsRequest, endRescheduleAppointment, setOpenSlots, setRescheduledAppointment, startOpenSlotsRequest, startRescheduleAppointment } from '../store/reschedule-appointment.slice';
import Logger from '../../../../shared/services/logger';
import dayjs from 'dayjs';
const logger = Logger.getInstance();

export const getOpenSlots = (providerId: number, departmentId: number, appointmentTypeId: number, startDate: Date, endDate: Date) => {
    let getOpenSlotsUrl = `/appointments/open-slots?ignoreschedulablepermission=true`;
    getOpenSlotsUrl = getOpenSlotsUrl + `&departmentId=${departmentId}`;
    getOpenSlotsUrl = getOpenSlotsUrl + `&providerId=${providerId}`;
    getOpenSlotsUrl = getOpenSlotsUrl + `&appointmentTypeId=${appointmentTypeId}`;
    getOpenSlotsUrl = getOpenSlotsUrl + `&startDate=${dayjs(startDate).format('yyyy-MM-dd')}`;
    getOpenSlotsUrl = getOpenSlotsUrl + `&endDate=${dayjs(endDate).format('yyyy-MM-dd')}`;
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
    const getOpenSlotsUrl = `/appointments/${appointmentId}/reschedule`;
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
