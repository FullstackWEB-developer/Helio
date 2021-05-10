import SvgIcon from '@components/svg-icon/svg-icon';
import {SnackbarType} from '@components/snackbar/snackbar-position.enum';
import {Icon} from '@components/svg-icon/icon';
import Button from '@components/button/button';
import {useTranslation} from 'react-i18next';
import {SnackbarMessageModel} from '@components/snackbar/snackbar-message.model';
import {useDispatch} from 'react-redux';
import {removeSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {useEffect} from 'react';
import './snackbar-message.scss';
import {SnackbarPosition} from '@components/snackbar/snackbar-type.enum';

export interface SnackbarMessageProps {
    message: SnackbarMessageModel;
    position: SnackbarPosition;
}

const SnackbarMessage = ({message, position}: SnackbarMessageProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const deleteToast = () => {
        dispatch(removeSnackbarMessage(message.id!));
    }

    useEffect(() => {
        if (message.autoClose === undefined || message.autoClose) {
            setTimeout(() => {
                deleteToast()
            }, 3000);
        }
    });

    const buttonClicked = () => {
        if (message.onButtonClick) {
            message.onButtonClick();
        }
    }

    return <div key={message.id!}
                className={` pl-4 py-3 shadow-lg snackbar-message-body overflow-hidden relative rounded-md snackbar-position-${position}`}>
        <div className='flex flex-row'>

            {message.type && message.type !== SnackbarType.Info && <div className='pr-2'><SvgIcon
                fillClass={message.type === (SnackbarType.Success) ? 'success-icon' : 'danger-icon'}
                type={message.type === SnackbarType.Success ? Icon.CheckmarkOutline : Icon.Error}/></div>}

            <div className="flex items-center flex-1 body2-white">
                {t(message.message)}
            </div>

            {message.onButtonClick && message.buttonTitle && <div className='pr-4'>
                <Button className='secondary-button-snackbar' buttonType='secondary' label={t(message.buttonTitle)}
                        onClick={() => buttonClicked()}/>
            </div>}

            <div className='flex pt-1 snackbar-close-button cursor-pointer' onClick={() => deleteToast()}>
                <SvgIcon type={Icon.Close} className='icon-small' fillClass='snackbar-close-button-fill'/>
            </div>
        </div>
    </div>;
}
export default SnackbarMessage;
