import { combineReducers } from '@reduxjs/toolkit';
import redirectLinkReducer from '../hipaa-verification/store/redirect-link-slice.slice';
import requestRefillReducer from '../request-refill/store/request-refill.slice';
import requestLabResultReducer from '../lab-results/store/lab-results.slice';

const externalAccessState = combineReducers({
    redirectLinkState: redirectLinkReducer,
    requestRefillState: requestRefillReducer,
    requestLabResultState: requestLabResultReducer
})

export default externalAccessState;
