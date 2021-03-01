import {HotSpotInfo} from '../models/hotspot.model';

export interface AppointmentsState {
    isHotspotsLoading: boolean;
    isHotspotsError: boolean;
    hotspots: HotSpotInfo[];
}

const initialAppointmentsState: AppointmentsState = {
    isHotspotsLoading: false,
    isHotspotsError: false,
    hotspots: []
}

export default initialAppointmentsState;
