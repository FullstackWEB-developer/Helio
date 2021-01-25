export interface CcpState {
    chatCounter: number;
    voiceCounter: number;
}

const initialState: CcpState = {
    chatCounter: 0,
    voiceCounter: 0
}

export default initialState;
