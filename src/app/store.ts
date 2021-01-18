import { AnyAction, combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import ticketReducer from '../pages/tickets/store/tickets.slice';
import appUserReducer from '../shared/store/app-user/appuser.slice';
import layoutReducer from '../shared/layout/store/layout.slice';
import { useDispatch } from "react-redux";
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'
const persistenceStoreName = 'helio-ui-store';
const reducers = combineReducers({
    ticketState: ticketReducer,
    layoutState: layoutReducer,
    appUserState: appUserReducer
})

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
    if (action.type === "user/loginInitiated") {
        state = {} as RootState;
    }
    return reducers(state, action);
};

const persistConfig = {
    key: persistenceStoreName,
    storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk]
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types