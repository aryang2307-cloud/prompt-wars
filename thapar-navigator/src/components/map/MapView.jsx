import { useEffect } from 'react';
import { Circle, GeoJSON, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { ErrorBoundary } from 'react-error-boundary';
import L from 'leaflet';
import { Check, Copy, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { CAT } from '../../data';
import { CAMPUS_CENTER, EVENT_MARKERS, WIFI_ZONES } from '../../data/overlays';
import { COOL_ROUTE_GEOJSON } from '../../data/coolRoutes';
import { PopupContent } from '../cards/LocationDetails';



function MapController({ location }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(timer);
  }, [map]);
  useEffect(() => {
    if (location) map.flyTo([location.lat, location.lng], 18, { duration: 1.3, easeLinearity: 0.2 });
  }, [location, map]);
  return null;
}

function FriendMarkerController({ requestId, onLocation }) {
  const map = useMap();
  useEffect(() => {
    const updateLocation = (location) => {
      onLocation(location); map.flyTo([location.lat, location.lng], 17, { duration: 1 });
    };
    if (!requestId) return undefined;
    if (!navigator.geolocation) { updateLocation(CAMPUS_CENTER); return undefined; }
    const watchId = navigator.geolocation.watchPosition(({ coords }) => updateLocation({ lat: coords.latitude, lng: coords.longitude }), () => updateLocation(CAMPUS_CENTER), { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 });
    return () => { navigator.geolocation.clearWatch(watchId); };
  }, [map, onLocation, requestId]);
  return null;
}

function FriendPopup({ location, onCopy, copied }) {
  const params = new URLSearchParams();
  params.set('friend', `${location.lat},${location.lng}`);
  const link = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  return <div className="min-w-[150px]"><p className="m-0 mb-1 font-semibold">My temporary marker</p><p className="m-0 mb-2 text-[10px]">Share this location with your friend.</p><button type="button" onClick={() => onCopy(link)} className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-2.5 py-1.5 text-[11px] font-semibold text-white">{copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy location link'}</button></div>;
}

const iconCache = new Map();
function markerIcon(category, selected, theme, emergency = false) {
  const cacheKey = `${category}-${selected}-${theme}-${emergency}`;
  if (iconCache.has(cacheKey)) return iconCache.get(cacheKey);

  const config = CAT[category] || {};
  const size = selected ? 22 : 13;
  const color = config.color || '#6b7280';
  const shadow = `0 1px ${selected ? 4 : 2}px rgba(0,0,0,0.25)`;
  
  const div = document.createElement('div');
  if (emergency) div.className = 'emergency-marker';
  div.style.width = `${size}px`;
  div.style.height = `${size}px`;
  div.style.background = color;
  div.style.border = `2px solid ${theme === 'dark' ? 'rgba(255,255,255,.92)' : '#fff'}`;
  div.style.borderRadius = '50%';
  div.style.boxShadow = shadow;
  
  const icon = L.divIcon({ className: '', html: div, iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
  iconCache.set(cacheKey, icon);
  return icon;
}

function MapErrorFallback() {
  return <div className="absolute inset-0 flex items-center justify-center bg-slate-100 p-6 text-center"><div><MapPin size={28} className="mx-auto mb-2 text-slate-400" /><p className="m-0 text-sm font-semibold">Map unavailable</p><p className="m-0 mt-1 text-xs text-slate-500">Use the location list to browse campus details.</p></div></div>;
}

/** Render the Leaflet map, campus overlays, and interactive location markers. */
export function MapView({ locations, selected, flyTo, theme, shadeMode, wifiMode, eventMode, friendRequest, friendMarker, friendLinkCopied, emergencyFocus, healthCentre, onSelect, onFriendLocation, onCopyFriendLink }) {
  useEffect(() => {
    if (L.Icon?.Default?.prototype) {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
    }
  }, []);

  return <ErrorBoundary FallbackComponent={MapErrorFallback}><MapContainer center={[CAMPUS_CENTER.lat, CAMPUS_CENTER.lng]} zoom={16} className="absolute inset-0 z-0 h-full w-full" zoomControl={false}><TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" className={theme === 'dark' ? 'dark-map-tiles' : ''} maxZoom={19} /><MapController location={flyTo} />
    {shadeMode && <GeoJSON data={COOL_ROUTE_GEOJSON} style={(feature) => ({ color: feature?.properties?.zone === 'route' ? '#2563eb' : '#10b981', weight: feature?.properties?.zone === 'route' ? 5 : 2, dashArray: '12 9', fillColor: '#60a5fa', fillOpacity: feature?.properties?.zone === 'route' ? 0 : 0.22, opacity: 0.85 })} />}
    {wifiMode && WIFI_ZONES.map((zone) => <Circle key={zone.name} center={zone.center} radius={zone.radius} pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.2, weight: 2 }} />)}
    <FriendMarkerController requestId={friendRequest} onLocation={onFriendLocation} />
    {eventMode && EVENT_MARKERS.map((event) => <Marker key={event.title} position={event.position} icon={markerIcon(event.category, true, theme)} title={event.title}><Popup><strong>{event.title}</strong><br />{event.description}</Popup></Marker>)}
    {friendMarker && <Marker position={[friendMarker.lat, friendMarker.lng]} icon={markerIcon('facility', true, theme)} title="My temporary friend marker"><Popup><FriendPopup location={friendMarker} onCopy={onCopyFriendLink} copied={friendLinkCopied} /></Popup></Marker>}
    {locations.map((location) => <Marker key={location.id} position={[location.lat, location.lng]} alt={location.name} title={`Open details for ${location.name}`} icon={markerIcon(location.category, selected?.id === location.id, theme, emergencyFocus && healthCentre?.id === location.id)} eventHandlers={{ click: () => onSelect(location) }}><Popup minWidth={170}><PopupContent location={location} /></Popup></Marker>)}
  </MapContainer></ErrorBoundary>;
}
