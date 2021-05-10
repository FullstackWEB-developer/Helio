import {RootState} from '../../../app/store';
import {SnackbarMessageModel} from '@components/snackbar/snackbar-message.model';

export const selectSnackbarMessages = (state: RootState) => state.snackbarState.messages ? state.snackbarState.messages : [] as SnackbarMessageModel[];
