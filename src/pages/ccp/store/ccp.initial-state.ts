import {BotContext} from "../models/bot-context";

export interface CcpState {
    chatCounter: number;
    voiceCounter: number;
    contextPanel: string;
    botContext?: BotContext;
}

const initialState: CcpState = {
    chatCounter: 0,
    voiceCounter: 0,
    contextPanel: '',
    botContext: undefined,
}

export default initialState;
