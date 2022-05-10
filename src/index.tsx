import React, { Suspense } from 'react';
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
import SvgIcon, { Icon } from '@components/svg-icon';

const rootElement = document.getElementById('root');
const persistor = persistStore(store);

let logger = Logger.getInstance();
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
            onError: (error: any) => {
                logger.error("Query Error ", error.isAxiosError ? error.toJSON() : error);
            }
        },
        mutations: {
            onError: (error: any) => {
                logger.error("Mutation Error ", error.isAxiosError ? error.toJSON() : error);
            }
        }
    }
});

const spinner = (
    <div className='flex flex-col space-y-4 items-center h-full w-full justify-center'>
        <SvgIcon type={Icon.Spinner} className={`icon-large-40`}/>
    </div>
)

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}> 
                <Suspense fallback={spinner}>
                    <InitializeApp />
                </Suspense>
            </QueryClientProvider>
        </PersistGate>
    </Provider>,
    rootElement);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
