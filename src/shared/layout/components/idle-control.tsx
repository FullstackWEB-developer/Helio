import { useIdleTimer } from 'react-idle-timer';
import { addSnackbarMessage, removeAllSnackbarMessages } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import {useDispatch} from 'react-redux';
import { SnackbarPosition } from '@components/snackbar/snackbar-position.enum';
import utils from '@shared/utils/utils';
import { OneMinute } from '@constants/react-query-constants';
const IdleControl = () => {
    const dispatch = useDispatch();
    const onIdle = async () => {
        if(isIdle() && utils.isLoggedIn()){
            utils.logout().then();
        }
    }

    const onPrompt = async () => {
        if(isPrompt() && utils.isLoggedIn()){
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'common.idle_warning',
                position: SnackbarPosition.TopCenter,
                autoClose: false
            }));
            start();
        }
    }

    const onActive = async () => {
        dispatch(removeAllSnackbarMessages());
    }

    const {
        isIdle,
        start
    } = useIdleTimer({
        onIdle,
        timeout: OneMinute,
        events: [
            'mousemove',
            'touchmove'
        ],
        startManually: true
    })

    const {
        isIdle: isPrompt
    } = useIdleTimer({
        onIdle: onPrompt,
        onActive,
        timeout: (Number(utils.getAppParameter("HelioInactiveTimeout")) - 1)  * OneMinute,
        events: [
            'mousemove',
            'touchmove'
        ]
    })

    return null;
};

export default IdleControl;
