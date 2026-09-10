import { useState } from 'react';
import { useMapContext, useFilterContext } from '../context';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CampusFeaturePanel } from './CampusFeaturePanel';
import { LocationCard } from './cards/LocationCard';
import { TimetableWidget } from './TimetableWidget';

export function MobileLayout() {
  const { locations = [], allLocations, shadeMode, setShadeMode, eventMode, setEventMode, nightMode, setNightMode, quietMode, setQuietMode, wifiMode, setWifiMode } = useFilterContext();
  const { selected, handleSelect: onSelect, handleFindFriend: onFindFriend, handleEmergency: onEmergency, deliveryCopied, handleCopyDelivery } = useMapContext();
  
  const [expanded, setExpanded] = useState(false);
  const safeLocations = Array.isArray(locations) ? locations : [];

  return (
    <aside className={`hidden max-[640px]:flex absolute bottom-0 left-0 right-0 z-[1002] max-h-[calc(100%_-_7.5rem)] w-full flex-col rounded-t-2xl border-t border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-[#070a14] ${expanded ? 'h-[78vh]' : 'h-auto'}`} aria-label="Mobile location panel">
      <button
        type="button"
        onClick={() => setExpanded((isExpanded) => !isExpanded)}
        aria-expanded={expanded}
        aria-controls="mobile-location-list"
        aria-label={expanded ? 'Collapse location panel' : 'Expand location panel'}
        className="relative flex w-full items-center justify-center border-0 bg-transparent py-1.5 text-slate-400 dark:text-slate-500 cursor-pointer"
      >
        <span className="h-1 w-10 rounded-full bg-current" aria-hidden="true" />
        {expanded ? <ChevronDown aria-hidden="true" size={16} className="absolute right-3" /> : <ChevronUp aria-hidden="true" size={16} className="absolute right-3" />}
      </button>
      <div className="flex gap-2 px-3 pb-2">
        <button type="button" onClick={onFindFriend} aria-label="Find my friend and drop a temporary marker" className="flex flex-1 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 py-2 text-[11px] font-semibold text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">Find My Friend</button>
        <button type="button" onClick={onEmergency} aria-label="Open emergency contacts" className="flex flex-1 items-center justify-center rounded-lg border border-red-200 bg-red-50 py-2 text-[11px] font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">SOS Emergency</button>
      </div>
      {expanded && <TimetableWidget locations={allLocations} onSelect={onSelect} />}
      <CampusFeaturePanel shadeMode={shadeMode} onShadeChange={setShadeMode} eventMode={eventMode} onEventChange={setEventMode} nightMode={nightMode} onNightChange={setNightMode} quietMode={quietMode} onQuietChange={setQuietMode} wifiMode={wifiMode} onWifiChange={setWifiMode} onCopyDelivery={handleCopyDelivery} copied={deliveryCopied} />
      <div id="mobile-location-list" className={`flex-1 overflow-y-auto px-2 pb-2 ${!expanded ? 'hidden' : ''}`}>
        {safeLocations.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-600 dark:text-slate-300">No locations found</p>
        ) : safeLocations.map((location) => (
          <LocationCard key={location.id} location={location} selected={selected?.id === location.id} onSelect={onSelect} />
        ))}
      </div>
    </aside>
  );
}
