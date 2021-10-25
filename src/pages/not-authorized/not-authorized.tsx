import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {addSnackbarMessage} from "@shared/store/snackbar/snackbar.slice";
import {SnackbarType} from "@components/snackbar/snackbar-type.enum";

const NotAuthorized = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addSnackbarMessage({
            type: SnackbarType.Error,
            message: 'security.not_authorized'
        }));
    }, [dispatch]);
    
    return (<></>);
}

export default NotAuthorized;