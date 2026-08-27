import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CAT, TABS } from '../data';
import { LocationFilters } from './LocationFilters';
import { TimetableWidget } from './TimetableWidget';
import { CampusFeaturePanel } from './CampusFeaturePanel';
import { LocationCard } from './cards/LocationCard';

export function MobileLayout({ locations = [], allLocations = locations, onSelect, onFindFriend, onEmergency, shadeMode, onShadeChange, eventMode, onEventChange, nightMode, onNightChange, quietMode, onQuietChange, wifiMode, onWifiChange, onCopyDelivery, deliveryCopied, selected = null, query = '', onQueryChange, tab = 'all', onTabChange }) {
  const [expanded, setExpanded] = useState(false);
  const safeLocations = Array.isArray(locations) ? locations : [];

  return (
    <aside className={`hidden max-[640px]:flex absolute bottom-0 left-0 right-0 z-[1002] max-h-[calc(100%_-_4rem)] w-full flex-col rounded-t-2xl border-t border-slate-200 bg-white/90 shadow-[0_-12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:border-white/5 dark:bg-[#070a14]/90 ${expanded ? 'h-[78vh]' : 'h-auto'}`} aria-label="Mobile location panel">
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
      <LocationFilters
        query={query}
        onQueryChange={onQueryChange}
        onClearQuery={() => onQueryChange?.('')}
        tab={tab}
        onTabChange={onTabChange}
        tabs={TABS}
        categories={CAT}
        resultCount={safeLocations.length}
      />
      <div className="flex gap-2 px-3 pb-2">
        <button type="button" onClick={onFindFriend} aria-label="Find my friend and drop a temporary marker" className="flex flex-1 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 py-2 text-[11px] font-semibold text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">Find My Friend</button>
        <button type="button" onClick={onEmergency} aria-label="Center map on campus health centre" className="flex flex-1 items-center justify-center rounded-lg border border-red-200 bg-red-50 py-2 text-[11px] font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">Health Centre</button>
      </div>
      {expanded && <TimetableWidget locations={allLocations} onSelect={onSelect} />}
      <CampusFeaturePanel shadeMode={shadeMode} onShadeChange={onShadeChange} eventMode={eventMode} onEventChange={onEventChange} nightMode={nightMode} onNightChange={onNightChange} quietMode={quietMode} onQuietChange={onQuietChange} wifiMode={wifiMode} onWifiChange={onWifiChange} onCopyDelivery={onCopyDelivery} copied={deliveryCopied} />
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
