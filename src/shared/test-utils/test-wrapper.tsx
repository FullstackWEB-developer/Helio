import configureStore from 'redux-mock-store';
import initialAppState from '@shared/store/app/app.initial-state';
import initialAppUserState from '@shared/store/app-user/appuser.initial-state';
import dayjs from 'dayjs';
import React from 'react';
import {Provider} from 'react-redux';
import {QueryClient, QueryClientProvider} from 'react-query';
import {BrowserRouter} from 'react-router-dom';
import thunk from 'redux-thunk'

export interface TestWrapperProps {
    mockState?: any,
    children: React.ReactNode
}

const TestWrapper = ({ mockState, children} : TestWrapperProps) => {
    const middlewares = [thunk]
    const mockStore = configureStore(middlewares);
    if (!mockState) {
        mockState = {
            appState: {
                ...initialAppState,
                displayLoginRequired: true,
                loginRequiredDismissed: false
            },
            appUserState: {
                ...initialAppUserState,
                expiresOn: dayjs().add(29, 'minutes').toDate()
            }
        };
    }

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: false
            }
        }
    });

    let store = mockStore(mockState);

    return <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                {children}
            </BrowserRouter>
        </QueryClientProvider>
    </Provider>
}

export default TestWrapper;
