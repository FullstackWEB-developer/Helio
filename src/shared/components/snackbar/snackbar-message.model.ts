import {SnackbarType} from '@components/snackbar/snackbar-position.enum';

export interface SnackbarMessageModel {
    id?: string;
    message: string;
    type?: SnackbarType;
    onButtonClick?: () => void;
    buttonTitle?: string;
    autoClose?: boolean;
}
