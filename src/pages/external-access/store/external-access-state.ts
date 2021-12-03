import {combineReducers} from '@reduxjs/toolkit';
import requestRefillReducer from '../request-refill/store/request-refill.slice';
import appointmentsReducer from '../appointment/store/appointments.slice';
import requestMedicalRecordsReducer from '../request-medical-records/store/medical-records.slice';
import verifyPatientSliceReducer from '../verify-patient/store/verify-patient.slice';
import ticketSmsSliceReducer from '../ticket-sms/store/ticket-sms.slice';
import registrationSlice from '../registration/store/registration.slice';


const externalAccessState = combineReducers({
    requestRefillState: requestRefillReducer,
    appointmentsState: appointmentsReducer,
    requestMedicalRecordState: requestMedicalRecordsReducer,
    verifyPatientState: verifyPatientSliceReducer,
    ticketSmsState: ticketSmsSliceReducer,
    patientRegistrationState: registrationSlice
})

export default externalAccessState;
