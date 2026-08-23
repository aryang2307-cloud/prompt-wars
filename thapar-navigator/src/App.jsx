import { Component, useState, useCallback, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin, X, ChevronRight, Copy, Check,
  Navigation, Clock, Star, Phone, AlertTriangle,
  Sun, Moon, LocateFixed
} from 'lucide-react';
import { EMERGENCY_CONTACTS } from './contacts';
import { CAT, LOCATIONS, TABS } from './data';
import { LocationFilters } from './components/LocationFilters';
import { MobileLayout } from './components/MobileLayout';
import { TimetableWidget } from './components/TimetableWidget';
import { CampusFeaturePanel } from './components/CampusFeaturePanel';
import { filterLocations } from './utils/filterLocations';
import { isLocationOpen } from './utils/locationStatus';
import { getCrowdStatus, getDeliveryLink, getNightLocations, getQuietStudyLocations } from './utils/campusFeatures';
import { MessMenuDrawer } from './components/MessMenuDrawer';
import { COOL_ROUTE_GEOJSON } from './data/coolRoutes';

const CAMPUS_CENTER = { lat: 30.3564, lng: 76.3625 };
const WIFI_ZONES = [
  { name: 'Fast fiber zone', center: [30.3548, 76.3698], radius: 180, color: '#22c55e' },
  { name: 'Reliable Wi-Fi zone', center: [30.3529, 76.3644], radius: 160, color: '#facc15' },
  { name: 'Low signal zone', center: [30.3564, 76.3620], radius: 150, color: '#ef4444' },
];

if (L.Icon?.Default?.prototype) {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

function MapController({ location }) {
  const map = useMap();

  useEffect(() => {
    // Force Leaflet to recalculate bounds after mounting
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
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
    if (!requestId) return;
    if (!navigator.geolocation) {
      onLocation(CAMPUS_CENTER);
      map.flyTo([CAMPUS_CENTER.lat, CAMPUS_CENTER.lng], 17, { duration: 1 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const location = { lat: coords.latitude, lng: coords.longitude };
        onLocation(location);
        map.flyTo([location.lat, location.lng], 17, { duration: 1 });
      },
      () => {
        onLocation(CAMPUS_CENTER);
        map.flyTo([CAMPUS_CENTER.lat, CAMPUS_CENTER.lng], 17, { duration: 1 });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    );
  }, [map, onLocation, requestId]);

  return null;
}

function FriendPopup({ location, onCopy, copied }) {
  const link = `${window.location.origin}${window.location.pathname}?friend=${location.lat},${location.lng}`;
  return (
    <div className="min-w-[150px]">
      <p className="m-0 mb-1 font-semibold text-slate-800 dark:text-slate-100">My temporary marker</p>
      <p className="m-0 mb-2 text-[10px] text-slate-600 dark:text-slate-300">Share this location with your friend.</p>
      <button type="button" onClick={() => onCopy(link)} className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-600">
        {copied ? <Check aria-hidden="true" size={12} /> : <Copy aria-hidden="true" size={12} />} {copied ? 'Copied' : 'Copy location link'}
      </button>
    </div>
  );
}

class MapErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 p-6 text-center dark:bg-[#0b0f19]">
          <div>
            <MapPin aria-hidden="true" size={28} className="mx-auto mb-2 text-slate-400" />
            <p className="m-0 text-sm font-semibold text-slate-700 dark:text-slate-200">Map unavailable</p>
            <p className="m-0 mt-1 text-xs text-slate-500 dark:text-slate-400">Use the location list to browse campus details.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Create a themed Leaflet marker icon for a campus location.
 *
 * @param {string} category - Location category id.
 * @param {boolean} isSelected - Whether the marker is selected.
 * @param {string} theme - Active color theme.
 * @returns {L.DivIcon} Configured Leaflet marker icon.
 */
function mkIcon(category, isSelected, theme, isEmergency = false) {
  const c   = CAT[category] || {};
  const col = c.color || '#6b7280';
  const glo = c.glow  || 'rgba(107,114,128,0.4)';
  const s   = isSelected ? 22 : 13;
  const b   = isSelected ? 3 : 2;
  const borderCol = theme === 'dark' ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,1)';
  const shadow = theme === 'dark' 
    ? `0 0 ${isSelected?20:7}px ${glo}, 0 2px 8px rgba(0,0,0,0.55)`
    : `0 0 ${isSelected?20:7}px ${glo}, 0 2px 6px rgba(0,0,0,0.25)`;

  return L.divIcon({
    className: '',
    html: `<div class="${isEmergency ? 'emergency-marker' : ''}" style="width:${s}px;height:${s}px;background:${col};border:${b}px solid ${borderCol};border-radius:50%;box-shadow:${shadow};"></div>`,
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
  });
}

function Stars({ rating }) {
  const value = Number.isFinite(rating) ? rating : 0;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Rating ${value} out of 5`}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={10}
          aria-hidden="true"
          fill={i <= Math.round(value) ? '#fbbf24' : 'none'}
          color={i <= Math.round(value) ? '#fbbf24' : '#94a3b8'}
          className="dark:text-slate-700"
        />
      ))}
      <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-[3px]">{value}</span>
    </span>
  );
}

function LocCard({ loc, isSelected, onSelect }) {
  if (!loc) return null;
  const c    = CAT[loc.category] || {};
  const Icon = c.icon || MapPin;
  const canteenOpen = loc.category === 'food' ? isLocationOpen(loc) : null;
  const crowdStatus = ['academic', 'food'].includes(loc.category) ? getCrowdStatus(loc) : null;
  return (
    <button
      id={`loc-card-${loc.id}`}
      onClick={() => onSelect(loc)}
      aria-label={`Show ${loc.name} on map`}
      aria-pressed={isSelected}
      className={`w-full text-left block p-2.5 rounded-xl mb-1.5 outline-none cursor-pointer transition-all duration-150 ${
        isSelected 
          ? 'bg-slate-200/50 dark:bg-white/10 border-slate-300 dark:border-white/20' 
          : 'bg-white/40 dark:bg-white/5 border-transparent dark:border-white/5 hover:bg-white/60 dark:hover:bg-white/10'
      } border`}
      style={isSelected ? { borderColor: `${c.color}40`, backgroundColor: `${c.color}15` } : {}}
    >
      <div className="flex items-start gap-2.5">
        <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border" style={{ backgroundColor: `${c.color}15`, borderColor: `${c.color}30` }}>
          <Icon size={15} color={c.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <p className="m-0 text-[12.5px] font-semibold text-slate-800 dark:text-slate-100 overflow-hidden text-ellipsis whitespace-nowrap">{loc.name}</p>
            <ChevronRight size={13} className="shrink-0 text-slate-400 dark:text-slate-600" />
          </div>
          {canteenOpen !== null && <span className={`inline-flex mt-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${canteenOpen ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}>{canteenOpen ? 'Open now' : 'Closed now'}</span>}
          {crowdStatus && <span className={`inline-flex mt-1 ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${crowdStatus.tone === 'red' ? 'bg-red-100 text-red-700' : crowdStatus.tone === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{crowdStatus.label}</span>}
          <Stars rating={loc.rating} />
          <p className="m-0 mt-1 text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock size={10} /> {loc.timing}
          </p>
        </div>
      </div>
    </button>
  );
}

function Detail({ loc, onClose, onOpenSOS, onCopyDelivery, deliveryCopied }) {
  if (!loc) return null;
  const c    = CAT[loc.category] || {};
  const Icon = c.icon || MapPin;
  const tags = Array.isArray(loc.tags) ? loc.tags : [];
  return (
    <div
      id="detail-panel"
      className="fade-slide-in absolute bottom-4 right-4 w-[285px] z-[1001] bg-white/95 dark:bg-[#090d19]/95 backdrop-blur-xl border rounded-[18px] p-4 shadow-2xl dark:shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
      style={{ borderColor: `${c.color}30`, boxShadow: `0 24px 60px rgba(0,0,0,0.1), 0 0 40px ${c.glow}15` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border" style={{ backgroundColor: `${c.color}15`, borderColor: `${c.color}35` }}>
            <Icon size={18} color={c.color} />
          </div>
          <div>
            <p className="m-0 mb-0.5 text-[13.5px] font-bold text-slate-800 dark:text-slate-100 font-['Space_Grotesk'] leading-tight">{loc.name}</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium border" style={{ backgroundColor: `${c.color}20`, color: c.color, borderColor: `${c.color}30` }}>{c.label}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label={`Close details for ${loc.name}`}
          className="bg-transparent border-none cursor-pointer p-1 rounded-md shrink-0 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <X size={15} />
        </button>
      </div>
      <p className="m-0 mb-3 text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">{loc.description}</p>
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Clock size={11} /> {loc.timing}
        </span>
        <Stars rating={loc.rating} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map(t => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">{t}</span>
        ))}
      </div>
      {loc.id === 38 && <button type="button" onClick={onOpenSOS} className="mt-3 w-full rounded-lg bg-red-500 px-3 py-2 text-[11px] font-semibold text-white hover:bg-red-600">Emergency contacts</button>}
      {(loc.category === 'food' || loc.category === 'hostel') && <button type="button" onClick={onCopyDelivery} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"><Copy aria-hidden="true" size={12} /> {deliveryCopied ? 'Delivery link copied' : 'Copy delivery pin'}</button>}
    </div>
  );
}

function PopupContent({ loc }) {
  if (!loc) return null;
  const c = CAT[loc.category] || {};
  const tags = Array.isArray(loc.tags) ? loc.tags : [];
  return (
    <div aria-label={`Details for ${loc.name}`}>
      <p className="m-0 mb-1 font-bold text-[13px] text-slate-800 dark:text-slate-100 font-['Space_Grotesk']">{loc.name}</p>
      <p className="m-0 mb-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
        <Clock size={10} /> {loc.timing}
      </p>
      <div className="flex gap-1 flex-wrap">
        {tags.slice(0,3).map(t => (
          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full border" style={{ backgroundColor: `${c.color}15`, color: c.color, borderColor: `${c.color}30` }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function SOSModal({ onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-[#04060c]/85 backdrop-blur-md z-[9999] flex items-center justify-center p-5" role="presentation">
      <div className="fade-slide-in w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-[#0f1423]/95 border border-red-500/30 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.3)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_60px_rgba(239,68,68,0.15)] flex flex-col" role="dialog" aria-modal="true" aria-labelledby="sos-title">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-[#0f1423]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center animate-[pulseGlowRed_2s_infinite]">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <div>
              <h2 id="sos-title" className="m-0 text-[22px] font-bold text-slate-900 dark:text-slate-100 font-['Space_Grotesk'] tracking-tight">Emergency SOS</h2>
              <p className="m-0 text-[13.5px] text-slate-600 dark:text-slate-300">Tap any number below to call instantly</p>
            </div>
          </div>
          <button ref={closeButtonRef} onClick={onClose} aria-label="Close emergency contacts" className="bg-slate-100 dark:bg-white/5 border-none cursor-pointer p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 max-[640px]:p-4">
          {EMERGENCY_CONTACTS.map((section, idx) => (
            <div key={idx} className="mb-7">
              <h3 className="m-0 mb-3 text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{section.category}</h3>
              <div className="grid gap-3.5 grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))]">
                {section.contacts.map((contact, cIdx) => (
                  <a key={cIdx} href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} aria-label={`Call ${contact.name} at ${contact.phone}`} className="no-underline group">
                    <div className="p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3.5 group-hover:bg-red-50 dark:group-hover:bg-red-500/10 group-hover:border-red-200 dark:group-hover:border-red-500/30">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                        <Phone size={18} className="text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="m-0 mb-0.5 text-[14.5px] font-semibold text-slate-800 dark:text-slate-100 truncate">{contact.name}</p>
                        <p className="m-0 mb-0.5 text-[13px] font-medium text-red-500">{contact.phone}</p>
                        <p className="m-0 text-[11px] text-slate-600 dark:text-slate-300 truncate">{contact.description}</p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [query,    setQuery]    = useState('');
  const [tab,      setTab]      = useState('all');
  const [selected, setSelected] = useState(null);
  const [flyTo,    setFlyTo]    = useState(null);
  const [showSOS,  setShowSOS]  = useState(false);
  const [friendRequest, setFriendRequest] = useState(0);
  const [friendMarker, setFriendMarker] = useState(null);
  const [friendLinkCopied, setFriendLinkCopied] = useState(false);
  const [emergencyFocus, setEmergencyFocus] = useState(false);
  const [shadeMode, setShadeMode] = useState(false);
  const [eventMode, setEventMode] = useState(false);
  const [deliveryCopied, setDeliveryCopied] = useState(false);
  const [wifiMode, setWifiMode] = useState(false);
  const [messHostel, setMessHostel] = useState(null);
  const [nightMode, setNightMode] = useState(false);
  const [quietMode, setQuietMode] = useState(false);
  const [, setCurrentTime] = useState(0);
  
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const filteredLocations = filterLocations(LOCATIONS, tab, query, CAT);
  const locations = quietMode
    ? getQuietStudyLocations(filteredLocations)
    : nightMode ? getNightLocations(filteredLocations) : filteredLocations;

  const handleSelect = useCallback((loc) => {
    setSelected(loc);
    setFlyTo(loc);
    setEmergencyFocus(false);
    setMessHostel(loc?.category === 'hostel' ? loc : null);
  }, []);
  const handleClose  = useCallback(() => { setSelected(null); setFlyTo(null); }, []);
  const handleFindFriend = () => setFriendRequest((request) => request + 1);
  const handleFriendLocation = useCallback((location) => {
    setFriendMarker(location);
    setFriendLinkCopied(false);
  }, []);
  const handleCopyFriendLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setFriendLinkCopied(true);
    } catch {
      setFriendLinkCopied(false);
    }
  };
  const handleCopyDelivery = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(getDeliveryLink(selected));
      setDeliveryCopied(true);
    } catch {
      setDeliveryCopied(false);
    }
  };
  const healthCentre = LOCATIONS.find((location) => location.id === 38);
  const handleEmergency = () => {
    if (!healthCentre) return;
    setNightMode(false);
    setQuietMode(false);
    setEmergencyFocus(true);
    setSelected(healthCentre);
    setFlyTo(healthCentre);
  };

  const tileUrl = theme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-5 max-[640px]:px-3 h-14 bg-white/90 dark:bg-[#080c18]/92 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 z-50 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="pulse-glow w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Navigation size={17} className="text-white" />
          </div>
          <div>
            <h1 className="m-0 text-[15.5px] font-bold text-slate-800 dark:text-slate-100 font-['Space_Grotesk'] tracking-tight leading-tight">
              Thapar Navigator
            </h1>
            <p className="m-0 text-[10.5px] text-slate-600 dark:text-slate-300 max-[640px]:hidden">Campus Wayfinding System</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 max-[640px]:gap-2">
          <button 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-all border border-slate-200 dark:border-transparent outline-none cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button 
            onClick={handleEmergency}
            aria-label="Center map on campus health centre"
            className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 cursor-pointer transition-all hover:bg-red-200 dark:hover:bg-red-500/25 hover:shadow-[0_0_12px_rgba(239,68,68,0.3)] outline-none"
          >
            <AlertTriangle size={14} /> SOS
          </button>
          <button type="button" onClick={handleFindFriend} aria-label="Find my friend and drop a temporary marker" title="Find My Friend" className="flex h-8 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 text-[11px] font-semibold text-blue-600 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
            <LocateFixed aria-hidden="true" size={14} /> <span className="hidden sm:inline">Find My Friend</span>
          </button>
          
          <span className="flex items-center gap-1.5 text-[11.5px] text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e88] inline-block" />
            Live
          </span>
          <span className="text-[11px] text-slate-600 dark:text-slate-300 hidden sm:inline">{LOCATIONS.length} Locations</span>
          <span className="text-[11px] font-medium px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 hidden md:inline">
            TIET &middot; Patiala, Punjab
          </span>
        </div>
      </header>

      {/* Body */}
      <div className="relative flex-1 flex overflow-hidden">

        {/* Sidebar */}
        <aside className="w-[280px] max-[640px]:hidden shrink-0 flex flex-col bg-white/80 dark:bg-[#070a14]/88 border-r border-slate-200 dark:border-white/5 transition-colors duration-300">
          <LocationFilters
            query={query}
            onQueryChange={setQuery}
            onClearQuery={() => setQuery('')}
            tab={tab}
            onTabChange={setTab}
            tabs={TABS}
            categories={CAT}
            resultCount={locations.length}
          />
          <TimetableWidget locations={LOCATIONS} onSelect={handleSelect} />
          <CampusFeaturePanel shadeMode={shadeMode} onShadeChange={setShadeMode} eventMode={eventMode} onEventChange={setEventMode} nightMode={nightMode} onNightChange={setNightMode} quietMode={quietMode} onQuietChange={setQuietMode} wifiMode={wifiMode} onWifiChange={setWifiMode} onCopyDelivery={handleCopyDelivery} copied={deliveryCopied} />

          {/* List */}
          <div id="location-list" className="flex-1 overflow-y-auto px-2 pb-2">
            {locations.length === 0 ? (
              <div className="text-center py-10">
                <MapPin size={28} className="mx-auto mb-2 block text-slate-300 dark:text-slate-700" />
                <p className="m-0 text-[13px] text-slate-600 dark:text-slate-300">No locations found</p>
                <p className="m-0 mt-1 text-[11px] text-slate-400 dark:text-slate-500">Try a different search</p>
              </div>
            ) : locations.map(loc => (
              <LocCard key={loc.id} loc={loc} isSelected={selected ? selected.id === loc.id : false} onSelect={handleSelect} />
            ))}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-slate-200 dark:border-white/5 text-center shrink-0 max-[640px]:hidden">
            <p className="m-0 text-[10px] text-slate-400 dark:text-slate-600">Thapar Institute of Engineering &amp; Technology</p>
          </div>
        </aside>

        <MobileLayout
          locations={locations}
          allLocations={LOCATIONS}
          onSelect={handleSelect}
          onFindFriend={handleFindFriend}
          onEmergency={handleEmergency}
          shadeMode={shadeMode}
          onShadeChange={setShadeMode}
          eventMode={eventMode}
          onEventChange={setEventMode}
          onCopyDelivery={handleCopyDelivery}
          deliveryCopied={deliveryCopied}
          nightMode={nightMode}
          onNightChange={setNightMode}
          quietMode={quietMode}
          onQuietChange={setQuietMode}
          wifiMode={wifiMode}
          onWifiChange={setWifiMode}
          selected={selected}
          query={query}
          onQueryChange={setQuery}
          tab={tab}
          onTabChange={setTab}
        />

        {/* Map */}
        <main className="flex-1 relative overflow-hidden bg-[#e5e7eb] dark:bg-[#0b0f19] transition-colors duration-300" aria-label="Interactive campus map">
          <MapErrorBoundary>
            <MapContainer
              center={[30.3564, 76.3625]}
              zoom={16}
              className="w-full h-full absolute inset-0 z-0"
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url={tileUrl}
                subdomains="abcd"
                maxZoom={20}
              />
              <MapController location={flyTo} />
              {shadeMode && <GeoJSON data={COOL_ROUTE_GEOJSON} style={(feature) => ({
                color: feature?.properties?.zone === 'route' ? '#2563eb' : feature?.properties?.zone === 'plaza' ? '#10b981' : '#2563eb',
                weight: feature?.properties?.zone === 'route' ? 5 : 2,
                dashArray: feature?.properties?.zone === 'route' ? '12 9' : '8 6',
                fillColor: feature?.properties?.zone === 'plaza' ? '#34d399' : '#60a5fa',
                fillOpacity: feature?.properties?.zone === 'route' ? 0 : 0.22,
                opacity: 0.85,
              })} />}
              {wifiMode && WIFI_ZONES.map((zone) => <Circle key={zone.name} center={zone.center} radius={zone.radius} pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.2, weight: 2 }} />)}
              <FriendMarkerController requestId={friendRequest} onLocation={handleFriendLocation} />
              {eventMode && <>
                <Marker position={[30.3542, 76.3635]} icon={mkIcon('facility', true, theme)} title="Saturnalia stage"><Popup><strong>Saturnalia stage</strong><br />Temporary event stage</Popup></Marker>
                <Marker position={[30.3537, 76.3668]} icon={mkIcon('food', true, theme)} title="Urja food stalls"><Popup><strong>Urja food stalls</strong><br />Temporary event food area</Popup></Marker>
              </>}
              {friendMarker && <Marker position={[friendMarker.lat, friendMarker.lng]} icon={mkIcon('facility', true, theme)} title="My temporary friend marker">
                <Popup><FriendPopup location={friendMarker} onCopy={handleCopyFriendLink} copied={friendLinkCopied} /></Popup>
              </Marker>}
              {locations.map(loc => (
                <Marker
                  key={loc.id}
                  position={[loc.lat, loc.lng]}
                  alt={loc.name}
                  title={`Open details for ${loc.name}`}
                  icon={mkIcon(loc.category, selected ? selected.id === loc.id : false, theme, emergencyFocus && healthCentre?.id === loc.id)}
                  eventHandlers={{ click: () => handleSelect(loc) }}
                >
                  <Popup minWidth={170}><PopupContent loc={loc} /></Popup>
                </Marker>
              ))}
            </MapContainer>
          </MapErrorBoundary>

          {/* Legend */}
          <div className="absolute top-3 right-3 z-[1001] bg-white/95 dark:bg-[#070a14]/92 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl p-3 shadow-lg">
            <p className="m-0 mb-2 text-[9.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.8px]">Legend</p>
            {Object.entries(CAT).map(([k, c]) => (
              <div key={k} className="flex items-center gap-2 mb-1.5 last:mb-0">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color, boxShadow: `0 0 7px ${c.glow}` }} />
                <span className="text-[11px] text-slate-600 dark:text-slate-400">{c.label}</span>
              </div>
            ))}
          </div>

          {/* Campus label */}
          <div className="absolute bottom-5 left-3 z-[1001] bg-white/90 dark:bg-[#070a14]/88 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-lg py-1.5 px-3 text-[11.5px] text-slate-600 dark:text-slate-400 shadow-sm">
            TIET Campus &middot; Patiala, Punjab
          </div>

          {/* Hint */}
          <div className="absolute top-3 left-3 z-[1001] bg-white/90 dark:bg-[#070a14]/82 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-lg py-1.5 px-2.5 text-[10.5px] text-slate-500 dark:text-slate-400 shadow-sm">
            Scroll to zoom &middot; Click a marker for details
          </div>

          {/* Detail overlay */}
          {shadeMode && <div className="absolute bottom-5 left-3 z-[1001] max-w-[250px] rounded-lg border border-amber-300 bg-amber-50/95 px-3 py-2 text-[11px] text-amber-800 shadow-sm dark:border-amber-500/30 dark:bg-[#291e0a]/95 dark:text-amber-200">Heat advisory: prefer indoor corridors and shaded paths during peak afternoon heat.</div>}
          {selected && <Detail loc={selected} onClose={handleClose} onOpenSOS={() => setShowSOS(true)} onCopyDelivery={handleCopyDelivery} deliveryCopied={deliveryCopied} />}
          {messHostel && <MessMenuDrawer hostel={messHostel} onClose={() => setMessHostel(null)} />}
        </main>
      </div>

      {/* SOS Modal Overlay */}
      {showSOS && <SOSModal onClose={() => setShowSOS(false)} />}
    </div>
  );
}
