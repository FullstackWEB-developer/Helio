import {RootState} from '../../../app/store';
import {SnackbarMessageModel} from '@components/snackbar/snackbar-message.model';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';

export const selectSnackbarMessages = (state: RootState) => state.snackbarState.messages ? state.snackbarState.messages : [] as SnackbarMessageModel[];

export const selectSnackbarMessagesByPosition = (state: RootState, position: SnackbarPosition): SnackbarMessageModel[] => {
    if (!state.snackbarState.messages) {
        return [];
    }
    const values = state.snackbarState.messages.filter((a: SnackbarMessageModel) => a.position === position);
    return values ? values : [];
}
