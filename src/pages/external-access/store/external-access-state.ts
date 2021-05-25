import {combineReducers} from '@reduxjs/toolkit';
import requestRefillReducer from '../request-refill/store/request-refill.slice';
import requestLabResultReducer from '../lab-results/store/lab-results.slice';
import appointmentsReducer from '../appointment/store/appointments.slice';
import requestMedicalRecordsReducer from '../request-medical-records/store/medical-records.slice';

const externalAccessState = combineReducers({
    requestRefillState: requestRefillReducer,
    requestLabResultState: requestLabResultReducer,
    appointmentsState: appointmentsReducer,
    requestMedicalRecordState: requestMedicalRecordsReducer
})

export default externalAccessState;
