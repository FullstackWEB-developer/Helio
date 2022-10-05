import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import {Icon} from '@components/svg-icon';

export interface SnackbarMessageModel {
    id?: string;
    message: string;
    type?: SnackbarType;
    onButtonClick?: () => void;
    buttonTitle?: string;
    autoClose?: boolean;
    position?: SnackbarPosition;
    durationInSeconds?: number;
    icon?: Icon,
    iconFill?: string;
    supportRichText?: boolean;
}
