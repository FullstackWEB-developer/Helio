import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';

export interface SnackbarMessageModel {
    id?: string;
    message: string;
    type?: SnackbarType;
    onButtonClick?: () => void;
    buttonTitle?: string;
    autoClose?: boolean;
    position?: SnackbarPosition;
}
