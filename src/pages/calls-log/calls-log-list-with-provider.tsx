import React, {useContext} from 'react';
import CallsLogList from './calls-log-list';
import CallsLogProvider from './context/calls-log-context';
const CallsLogListWithProvider = () => {

    return (
        <CallsLogProvider>
            <CallsLogList/>
        </CallsLogProvider>
    )
}

export default CallsLogListWithProvider;
