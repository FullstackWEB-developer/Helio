import { combineReducers } from '@reduxjs/toolkit';
import requestRefillReducer from '../request-refill/store/request-refill.slice';
import requestLabResultReducer from '../lab-results/store/lab-results.slice';
import rescheduleAppointmentReducer from '../reschedule-appointment/store/reschedule-appointment.slice';
import appointmentsReducer from '../appointment/store/appointments.slice';

const externalAccessState = combineReducers({
    requestRefillState: requestRefillReducer,
    requestLabResultState: requestLabResultReducer,
    rescheduleAppointmentState: rescheduleAppointmentReducer,
    appointmentsState: appointmentsReducer
})

export default externalAccessState;
