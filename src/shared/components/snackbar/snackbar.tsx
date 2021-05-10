import {SnackbarPosition} from '@components/snackbar/snackbar-type.enum';
import './snackbar.scss';
import {useSelector} from 'react-redux';
import SnackbarMessage from '@components/snackbar/snackbar-message';
import {SnackbarMessageModel} from '@components/snackbar/snackbar-message.model';
import {selectSnackbarMessages} from '@shared/store/snackbar/snackbar.selectors';

export interface SnackbarProps {
    position: SnackbarPosition;
    onButtonClick?: () => void;
}

const Snackbar = ({position}: SnackbarProps) => {
    const messages = useSelector(selectSnackbarMessages);
    return <div className={`fixed z-50 space-y-4 snackbar-position-${position}`}>
        {
            messages?.map((message: SnackbarMessageModel) =>
                <SnackbarMessage key={message.id} position={position} message={message}/>
            )
        }
    </div>
}

export default Snackbar;
