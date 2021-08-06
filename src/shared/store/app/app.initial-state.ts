export interface AppState {
    isGlobalLoading: boolean;
    modalOverlayActive: boolean;
}
const initialAppState: AppState = {
    isGlobalLoading : false,
    modalOverlayActive: false
}

export default initialAppState;
