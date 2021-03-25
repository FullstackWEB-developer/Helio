import Api from '../../../shared/services/api';

export const getHotSpots = async () => {
     const result = await Api.get('appointments/hotspots');
     return result.data;
}
