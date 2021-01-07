import { configureStore } from '@reduxjs/toolkit'
import ticketReducer from '../pages/tickets/store/tickets.slice'
import {useDispatch} from "react-redux";

const store = configureStore({
    reducer: {
        ticketState: ticketReducer
    }
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types