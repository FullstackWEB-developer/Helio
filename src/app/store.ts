import {AnyAction, combineReducers, configureStore, Reducer} from '@reduxjs/toolkit';
import ticketReducer from '../pages/tickets/store/tickets.slice';
import appUserReducer from '../shared/store/app-user/appuser.slice';
import appReducer from '../shared/store/app/app.slice';
import layoutReducer from '../shared/layout/store/layout.slice';
import ccpReducer from '../pages/ccp/store/ccp.slice';
import searchReducer from '../shared/components/search-bar/store/search-bar.slice';
import patientsReducer from '../pages/patients/store/patients.slice';
import externalAccessState from '../pages/external-access/store/external-access-state';
import lookupsReducer from '../shared/store/lookups/lookups.slice';
import contactsReducer from '../shared/store/contacts/contacts.slice';
import snackbarReducer from '../shared/store/snackbar/snackbar.slice';
import callsLogReducer from '../pages/calls-log/store/calls-log.slice';
import emailReducer from '../pages/email/store/email-slice';
import chatLogReducer from '../pages/chat-log/store/chat-log.slice';
import {useDispatch} from 'react-redux';
import storage from 'redux-persist/lib/storage'
import {persistReducer} from 'redux-persist'
import thunk from 'redux-thunk'
import usersReducer from '../pages/users/store/users.slice';
import smsReducer from '../pages/sms/store/sms.slice';

export const PersistenceStoreName =  'helio-ui-store';
const reducers = combineReducers({
    ticketState: ticketReducer,
    layoutState: layoutReducer,
    appUserState: appUserReducer,
    searchState: searchReducer,
    patientsState: patientsReducer,
    ccpState: ccpReducer,
    externalAccessState,
    lookupsState: lookupsReducer,
    contactState: contactsReducer,
    snackbarState: snackbarReducer,
    appState: appReducer,
    usersState: usersReducer,
    callsLogState: callsLogReducer,
    chatLogState: chatLogReducer,
    smsState: smsReducer,
    emailState: emailReducer
})

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
    if (action.type === 'layout/resetState') {
        const appParameters = state.appState.appParameters
        state = {
            appState : {
                appParameters
            }
        } as RootState;
    }
    return reducers(state, action);
};

const persistConfig = {
    key: PersistenceStoreName,
    storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
    reducer: persistedReducer,
    devTools: true,
    middleware: [thunk]
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types
