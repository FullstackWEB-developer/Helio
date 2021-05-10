import {SnackbarMessageModel} from '@components/snackbar/snackbar-message.model';

export interface SnackbarState {
    messages: SnackbarMessageModel[];
}

const initialSnackbarState: SnackbarState = {
    messages: []
}

export default initialSnackbarState;
