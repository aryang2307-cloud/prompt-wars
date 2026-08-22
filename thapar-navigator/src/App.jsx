import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Search, MapPin, X, ChevronRight,
  Navigation, Clock, Star, Phone, AlertTriangle,
  Sun, Moon
} from 'lucide-react';
import { EMERGENCY_CONTACTS } from './contacts';
import { CAT, LOCATIONS, TABS } from './data';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

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

function mkIcon(category, isSelected, theme) {
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
    html: `<div style="width:${s}px;height:${s}px;background:${col};border:${b}px solid ${borderCol};border-radius:50%;box-shadow:${shadow};"></div>`,
    iconSize: [s, s],
    iconAnchor: [s / 2, s / 2],
  });
}

function Stars({ rating }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={10}
          fill={i <= Math.round(rating) ? '#fbbf24' : 'none'}
          color={i <= Math.round(rating) ? '#fbbf24' : '#94a3b8'}
          className="dark:text-slate-700"
        />
      ))}
      <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-[3px]">{rating}</span>
    </span>
  );
}

function LocCard({ loc, isSelected, onSelect }) {
  const c    = CAT[loc.category] || {};
  const Icon = c.icon || MapPin;
  return (
    <button
      id={`loc-card-${loc.id}`}
      onClick={() => onSelect(loc)}
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
          <Stars rating={loc.rating} />
          <p className="m-0 mt-1 text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock size={10} /> {loc.timing}
          </p>
        </div>
      </div>
    </button>
  );
}

function Detail({ loc, onClose }) {
  const c    = CAT[loc.category] || {};
  const Icon = c.icon || MapPin;
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
            <p className="m-0 mb-0.5 text-[13.5px] font-bold text-slate-800 dark:text-slate-50 font-['Space_Grotesk'] leading-tight">{loc.name}</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium border" style={{ backgroundColor: `${c.color}20`, color: c.color, borderColor: `${c.color}30` }}>{c.label}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-transparent border-none cursor-pointer p-1 rounded-md shrink-0 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <X size={15} />
        </button>
      </div>
      <p className="m-0 mb-3 text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed">{loc.description}</p>
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Clock size={11} /> {loc.timing}
        </span>
        <Stars rating={loc.rating} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {loc.tags.map(t => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">{t}</span>
        ))}
      </div>
    </div>
  );
}

function PopupContent({ loc }) {
  const c = CAT[loc.category] || {};
  return (
    <div>
      <p className="m-0 mb-1 font-bold text-[13px] text-slate-800 dark:text-slate-100 font-['Space_Grotesk']">{loc.name}</p>
      <p className="m-0 mb-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
        <Clock size={10} /> {loc.timing}
      </p>
      <div className="flex gap-1 flex-wrap">
        {loc.tags.slice(0,3).map(t => (
          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full border" style={{ backgroundColor: `${c.color}15`, color: c.color, borderColor: `${c.color}30` }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function SOSModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-[#04060c]/85 backdrop-blur-md z-[9999] flex items-center justify-center p-5">
      <div className="fade-slide-in w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-[#0f1423]/95 border border-red-500/30 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.3)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_60px_rgba(239,68,68,0.15)] flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center sticky top-0 bg-white/95 dark:bg-[#0f1423]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center animate-[pulseGlowRed_2s_infinite]">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <div>
              <h2 className="m-0 text-[22px] font-bold text-slate-900 dark:text-slate-50 font-['Space_Grotesk'] tracking-tight">Emergency SOS</h2>
              <p className="m-0 text-[13.5px] text-slate-500 dark:text-slate-400">Tap any number below to call instantly</p>
            </div>
          </div>
          <button onClick={onClose} className="bg-slate-100 dark:bg-white/5 border-none cursor-pointer p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {EMERGENCY_CONTACTS.map((section, idx) => (
            <div key={idx} className="mb-7">
              <h3 className="m-0 mb-3 text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{section.category}</h3>
              <div className="grid gap-3.5 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                {section.contacts.map((contact, cIdx) => (
                  <a key={cIdx} href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="no-underline group">
                    <div className="p-3.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-3.5 group-hover:bg-red-50 dark:group-hover:bg-red-500/10 group-hover:border-red-200 dark:group-hover:border-red-500/30">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                        <Phone size={18} className="text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="m-0 mb-0.5 text-[14.5px] font-semibold text-slate-800 dark:text-slate-100 truncate">{contact.name}</p>
                        <p className="m-0 mb-0.5 text-[13px] font-medium text-red-500">{contact.phone}</p>
                        <p className="m-0 text-[11px] text-slate-500 dark:text-slate-400 truncate">{contact.description}</p>
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
  
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const locations = LOCATIONS.filter(loc => {
    const matchTab    = tab === 'all' || loc.category === tab;
    const q           = query.toLowerCase().trim();
    const matchSearch = !q
      || loc.name.toLowerCase().includes(q)
      || loc.shortName.toLowerCase().includes(q)
      || loc.tags.some(t => t.toLowerCase().includes(q))
      || (CAT[loc.category] && CAT[loc.category].label.toLowerCase().includes(q));
    return matchTab && matchSearch;
  });

  const handleSelect = useCallback((loc) => { setSelected(loc); setFlyTo(loc); }, []);
  const handleClose  = useCallback(() => { setSelected(null); setFlyTo(null); }, []);

  const tileUrl = theme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-5 h-14 bg-white/90 dark:bg-[#080c18]/92 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 z-50 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="pulse-glow w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Navigation size={17} className="text-white" />
          </div>
          <div>
            <h1 className="m-0 text-[15.5px] font-bold text-slate-800 dark:text-slate-50 font-['Space_Grotesk'] tracking-tight leading-tight">
              Thapar Navigator
            </h1>
            <p className="m-0 text-[10.5px] text-slate-500 dark:text-slate-400">Campus Wayfinding System</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5">
          <button 
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 transition-all border border-slate-200 dark:border-transparent outline-none cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button 
            onClick={() => setShowSOS(true)}
            className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 cursor-pointer transition-all hover:bg-red-200 dark:hover:bg-red-500/25 hover:shadow-[0_0_12px_rgba(239,68,68,0.3)] outline-none"
          >
            <AlertTriangle size={14} /> SOS
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
      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar */}
        <aside className="w-[280px] shrink-0 flex flex-col bg-white/80 dark:bg-[#070a14]/88 border-r border-slate-200 dark:border-white/5 transition-colors duration-300">
          {/* Search */}
          <div className="p-3 pb-1.5">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="location-search"
                type="text"
                placeholder="Search COS, Library, Mess..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full py-2.5 pr-8 pl-8 rounded-xl outline-none bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-[12.5px] transition-colors focus:border-blue-400 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-[#0c101e]"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex">
                  <X size={13} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="px-2.5 pb-2 flex gap-1 overflow-x-auto shrink-0 scrollbar-hide">
            {TABS.map(t => {
              const Icon   = t.icon;
              const active = tab === t.id;
              const cat    = CAT[t.id];
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer outline-none transition-all ${
                    active 
                      ? 'bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-100 shadow-sm'
                      : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                  style={active && cat ? { backgroundColor: `${cat.color}25`, color: cat.color, border: `1px solid ${cat.color}40` } : { border: '1px solid transparent' }}
                >
                  <Icon size={11} />{t.label}
                </button>
              );
            })}
          </div>

          {/* Count */}
          <div className="px-3.5 pb-1.5">
            <p className="m-0 text-[10.5px] text-slate-500 dark:text-slate-400">
              {locations.length} location{locations.length !== 1 ? 's' : ''}
              {query && <span className="text-slate-700 dark:text-slate-300"> &middot; &ldquo;{query}&rdquo;</span>}
            </p>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {locations.length === 0 ? (
              <div className="text-center py-10">
                <MapPin size={28} className="mx-auto mb-2 block text-slate-300 dark:text-slate-700" />
                <p className="m-0 text-[13px] text-slate-600 dark:text-slate-400">No locations found</p>
                <p className="m-0 mt-1 text-[11px] text-slate-400 dark:text-slate-500">Try a different search</p>
              </div>
            ) : locations.map(loc => (
              <LocCard key={loc.id} loc={loc} isSelected={selected ? selected.id === loc.id : false} onSelect={handleSelect} />
            ))}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-slate-200 dark:border-white/5 text-center shrink-0">
            <p className="m-0 text-[10px] text-slate-400 dark:text-slate-600">Thapar Institute of Engineering &amp; Technology</p>
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 relative overflow-hidden bg-[#e5e7eb] dark:bg-[#0b0f19] transition-colors duration-300">
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
            {locations.map(loc => (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={mkIcon(loc.category, selected ? selected.id === loc.id : false, theme)}
                eventHandlers={{ click: () => handleSelect(loc) }}
              >
                <Popup minWidth={170}><PopupContent loc={loc} /></Popup>
              </Marker>
            ))}
          </MapContainer>

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
          {selected && <Detail loc={selected} onClose={handleClose} />}
        </main>
      </div>

      {/* SOS Modal Overlay */}
      {showSOS && <SOSModal onClose={() => setShowSOS(false)} />}
    </div>
  );
}
