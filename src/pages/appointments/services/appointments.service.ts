import { Dispatch } from '@reduxjs/toolkit';
import Api from '../../../shared/services/api';
import Logger from '../../../shared/services/logger';
import { setHotSpots, setHotspotsLoading, setIsHotspotsError } from '../store/appointments.slice';
const logger = Logger.getInstance();

export const getHotSpots = () => {
    return async (dispatch: Dispatch) => {
        dispatch(setHotspotsLoading(true));
        await Api.get('appointments/hotspots')
            .then(response => {
                dispatch(setHotSpots(response.data));
            })
            .catch(error => {
                dispatch(setIsHotspotsError(true));
                logger.error('Failed getting Hotspots', error);
            })
    }
}
