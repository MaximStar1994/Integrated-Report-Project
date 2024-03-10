import rigiconmap from '../../assets/rigiconmap.png';
import YellowCircle from '../../assets/Icon/YellowCircle.png';
import L from 'leaflet';

const markerIcon = new L.Icon({
    iconUrl: rigiconmap,
    iconSize: [40,40],
    iconAnchor: [40, 40],
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
});

const trackingIcon = new L.Icon({
    iconUrl: YellowCircle,
    iconSize: [10,10],
    iconAnchor: [10, 10],
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null
});

export { markerIcon,trackingIcon };