import React from 'react';
import {Marker, Popup} from 'react-leaflet';
import MapViewer from '@components/map-viewer';
import {AppointmentDepartmentModel} from '@pages/external-access/appointment/models/appointment-department.model';
import {useTranslation} from 'react-i18next';
export interface AppointmentScheduleMapProps {
    departmentLatLng :AppointmentDepartmentModel[]
}
const AppointmentScheduleMap = ({departmentLatLng}: AppointmentScheduleMapProps) => {
    const {t} = useTranslation();

    return <MapViewer
        className='map-viewer'
        wrapperClassName='map-viewer-wrapper'
        zoomControl
        scrollWheelZoom
        bounds={departmentLatLng?.map(d => d.latLong)}
    >
        {departmentLatLng &&
        React.Children.toArray(departmentLatLng.map(l => (
            <Marker position={[l.latLong[0], l.latLong[1]]} >
                <Popup className='w-52'>
                    <b>{l.name}</b>
                    <p>{l.address}{l.address2 ? ', ' + l.address2: ''}, {l.city}, {l.state} {l.zip}</p>
                    <p>
                        <a rel='noreferrer' target='_blank' href={`https://maps.google.com/?q=${l?.latLong[0]},${l?.latLong[1]}`}>
                            {t('external_access.schedule_appointment.view_in_map')}
                        </a>
                    </p>
                </Popup>
            </Marker>
        )))
        }
    </MapViewer>
}

export default AppointmentScheduleMap;
