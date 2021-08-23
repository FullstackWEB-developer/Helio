import {ReactNode, useEffect} from "react";
import {MapContainer, TileLayer, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const MapViewerBounds = ({value}: {value?: Array<Array<number>>}) => {
    const map = useMap();

    useEffect(() => {
        if (!value || value.length < 1) {
            return;
        }
        const result = L.latLngBounds(value.map(p => L.latLng(p[0], p[1])));
        map.fitBounds(result);

    }, [value, map]);

    return null;
}

interface MapViewerProps {
    zoom?: number;
    scrollWheelZoom?: boolean;
    className?: string;
    wrapperClassName?: string
    children: ReactNode;
    bounds?: Array<Array<number>>;
    zoomControl?: boolean;
}

const MapViewer = (
    {
        className,
        wrapperClassName,
        bounds,
        children,
        zoomControl = false,
        scrollWheelZoom = false,
        zoom = 13
    }: MapViewerProps) => {

    useEffect(() => {
        const DefaultIcon = L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow
        });
        L.Marker.prototype.options.icon = DefaultIcon;
    }, []);

    return (
        <div className={wrapperClassName}>
            <MapContainer
                className={className}
                zoom={zoom}
                scrollWheelZoom={scrollWheelZoom}
                zoomControl={zoomControl}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {children}
                <MapViewerBounds value={bounds} />
            </MapContainer>
        </div>
    );
}

export default MapViewer;
