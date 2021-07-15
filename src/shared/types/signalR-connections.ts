import {HubConnection} from "@microsoft/signalr";

export interface SignalRConnections {
    [key: string]: HubConnection | undefined
}
