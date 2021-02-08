import { combineReducers } from '@reduxjs/toolkit';
import redirectLinkReducer from '../hipaa-verification/store/redirect-link-slice.slice';
import requestRefillReducer from '../request-refill/store/request-refill.slice';

const externalAccessState = combineReducers({
    redirectLinkState: redirectLinkReducer,
    requestRefillState: requestRefillReducer
})

export default externalAccessState;