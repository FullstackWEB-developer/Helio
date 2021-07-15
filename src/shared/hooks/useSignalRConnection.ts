import {useEffect, useReducer} from "react";
import {HubConnection} from '@microsoft/signalr';
import {signalRConnectionReducer} from '../store/signalR-connection';
import {SignalRConnections} from "@shared/types";

const initial: SignalRConnections = {};

export function useSignalRConnection(createConnection: () => HubConnection): SignalRConnections {
  const [state, setState] = useReducer(signalRConnectionReducer, initial);

  useEffect(() => {
    const connection = createConnection();
    connection
      .start()
      .then(() => setState({connection}))
      .catch(error => setState({error}));

    return () => {
      connection.stop();
    };
  }, [createConnection, setState]);

  return state;
}

