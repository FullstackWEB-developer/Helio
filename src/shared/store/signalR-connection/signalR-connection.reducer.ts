import {SignalRConnections} from '@shared/types';

export const signalRConnectionReducer = (
    state: SignalRConnections,
    partialState: Partial<SignalRConnections>
) => ({...state, ...partialState});
