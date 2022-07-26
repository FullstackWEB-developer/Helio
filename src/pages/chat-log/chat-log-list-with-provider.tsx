import React, {useContext} from 'react';
import ChatLogList from './chat-log-list';
import ChatLogProvider from '@pages/calls-log/context/calls-log-context';
const ChatLogListWithProvider = () => {

    return (
        <ChatLogProvider>
            <ChatLogList/>
        </ChatLogProvider>
    )
}

export default ChatLogListWithProvider;
