import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './app/app';
import store from './app/store';
import reportWebVitals from './reportWebVitals';
import './index.scss';
import '../src/i18n';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist';

const rootElement = document.getElementById('root');
const persistor = persistStore(store);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    rootElement);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
