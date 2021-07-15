import {ComponentType, createContext, ReactNode, useContext} from 'react';
import {SignalRConnections} from '@shared/types';
import {useSignalRConnection} from '@shared/hooks';
import {HubConnection} from '@microsoft/signalr';

export interface SignalRConnectionContext {
    Provider: ComponentType<SignalRProviderProps>;
}

const Context = createContext<SignalRConnections>({});

export interface SignalRProviderProps {
    children?: ReactNode;
    name: string;
    createConnection: () => HubConnection
}

export const SignalRProvider = (props: SignalRProviderProps) => {
    const newConnection = useSignalRConnection(props.createConnection);
    const currentConnection = useContext(Context)
    const value = {
        ...currentConnection,
        [props.name]: newConnection.connection
    };
    return <Context.Provider value={value}> {props.children} </Context.Provider>;
}

export const useSignalRConnectionContext = () => useContext(Context);
