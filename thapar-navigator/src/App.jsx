import { useCallback, useEffect, useState } from 'react';
import { CAT, LOCATIONS, TABS } from './data';
import { MobileLayout } from './components/MobileLayout';
import { LocationDetails } from './components/cards/LocationDetails';
import { SOSModal } from './components/cards/SOSModal';
import { MessMenuDrawer } from './components/MessMenuDrawer';
import { AppHeader } from './components/ui/AppHeader';
import { LocationSidebar } from './components/ui/LocationSidebar';
import { MapView } from './components/map/MapView';
import { filterLocations } from './utils/filterLocations';
import { getDeliveryLink, getNightLocations, getQuietStudyLocations } from './utils/campusFeatures';

/** Compose the high-level campus navigation state and page layout. */
export default function App() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState(null);
  const [flyTo, setFlyTo] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [showSOS, setShowSOS] = useState(false);
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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const filteredLocations = filterLocations(LOCATIONS, tab, query, CAT);
  const locations = quietMode ? getQuietStudyLocations(filteredLocations) : nightMode ? getNightLocations(filteredLocations) : filteredLocations;
  const healthCentre = LOCATIONS.find((location) => location.id === 38);
  const featureProps = { shadeMode, onShadeChange: setShadeMode, eventMode, onEventChange: setEventMode, nightMode, onNightChange: setNightMode, quietMode, onQuietChange: setQuietMode, wifiMode, onWifiChange: setWifiMode, onCopyDelivery: () => handleCopyDelivery(), copied: deliveryCopied };

  const handleSelect = useCallback((location) => {
    setSelected(location);
    setFlyTo(location);
    setEmergencyFocus(false);
    setMessHostel(location?.category === 'hostel' ? location : null);
  }, []);
  const handleClose = useCallback(() => { setSelected(null); setFlyTo(null); }, []);
  const handleFindFriend = () => setFriendRequest((request) => request + 1);
  const handleFriendLocation = useCallback((location) => { setFriendMarker(location); setFriendLinkCopied(false); }, []);
  const handleCopyFriendLink = async (link) => {
    try { await navigator.clipboard.writeText(link); setFriendLinkCopied(true); } catch { setFriendLinkCopied(false); }
  };
  const handleCopyDelivery = async () => {
    if (!selected) return;
    try { await navigator.clipboard.writeText(getDeliveryLink(selected)); setDeliveryCopied(true); } catch { setDeliveryCopied(false); }
  };
  const handleEmergency = () => {
    if (!healthCentre) return;
    setNightMode(false); setQuietMode(false); setEmergencyFocus(true); setSelected(healthCentre); setFlyTo(healthCentre);
  };

  return <div className="flex h-screen w-screen flex-col overflow-hidden"><AppHeader theme={theme} onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} onEmergency={handleEmergency} onFindFriend={handleFindFriend} locationCount={LOCATIONS.length} /><div className="relative flex flex-1 overflow-hidden">
    <LocationSidebar locations={locations} allLocations={LOCATIONS} selected={selected} onSelect={handleSelect} query={query} onQueryChange={setQuery} tab={tab} onTabChange={setTab} tabs={TABS} categories={CAT} featureProps={featureProps} />
    <MobileLayout locations={locations} allLocations={LOCATIONS} onSelect={handleSelect} onFindFriend={handleFindFriend} onEmergency={handleEmergency} {...featureProps} selected={selected} query={query} onQueryChange={setQuery} tab={tab} onTabChange={setTab} />
    <main className="relative flex-1 overflow-hidden bg-[#e5e7eb] dark:bg-[#0b0f19]" aria-label="Interactive campus map"><MapView locations={locations} selected={selected} flyTo={flyTo} theme={theme} shadeMode={shadeMode} wifiMode={wifiMode} eventMode={eventMode} friendRequest={friendRequest} friendMarker={friendMarker} friendLinkCopied={friendLinkCopied} emergencyFocus={emergencyFocus} healthCentre={healthCentre} onSelect={handleSelect} onFriendLocation={handleFriendLocation} onCopyFriendLink={handleCopyFriendLink} /><div className="absolute top-3 right-3 z-[1001] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg dark:border-white/10 dark:bg-[#070a14]/92"><p className="m-0 mb-2 text-[9.5px] font-bold uppercase text-slate-500">Legend</p>{Object.entries(CAT).map(([key, category]) => <div key={key} className="mb-1.5 flex items-center gap-2 last:mb-0"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.color }} /><span className="text-[11px] text-slate-600 dark:text-slate-400">{category.label}</span></div>)}</div><div className="absolute bottom-5 left-3 z-[1001] rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 text-[11.5px] text-slate-600 shadow-sm">TIET Campus &middot; Patiala, Punjab</div>{shadeMode && <div className="absolute bottom-5 left-3 z-[1001] max-w-[250px] rounded-lg border border-amber-300 bg-amber-50/95 px-3 py-2 text-[11px] text-amber-800 shadow-sm">Heat advisory: prefer indoor corridors and shaded paths during peak afternoon heat.</div>}<LocationDetails location={selected} onClose={handleClose} onOpenSOS={() => setShowSOS(true)} onCopyDelivery={handleCopyDelivery} deliveryCopied={deliveryCopied} />{messHostel && <MessMenuDrawer hostel={messHostel} onClose={() => setMessHostel(null)} />}</main>
  </div>{showSOS && <SOSModal onClose={() => setShowSOS(false)} />}</div>;
}
