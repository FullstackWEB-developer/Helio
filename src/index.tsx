import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import reportWebVitals from './reportWebVitals';
import './index.scss';
import '../src/i18n';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist';
import InitializeApp from '@app/initialize-app';
import {QueryClient, QueryClientProvider} from 'react-query';
import Logger from '@shared/services/logger';

const rootElement = document.getElementById('root');
const persistor = persistStore(store);

let logger = Logger.getInstance();
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
            onError: (error: any) => {
                logger.error("Query Error ", error.toJSON());
            }
        },
        mutations: {
            onError: (error: any) => {
                logger.error("Mutation Error ", error.toJSON());
            }
        }
    }
});

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
                <InitializeApp />
            </QueryClientProvider>
        </PersistGate>
    </Provider>,
    rootElement);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
