import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, ChevronRight, MapPin } from 'lucide-react';
import { CAT, TABS } from '../data';
import { LocationFilters } from './LocationFilters';
import { TimetableWidget } from './TimetableWidget';
import { CampusFeaturePanel } from './CampusFeaturePanel';
import { isLocationOpen } from '../utils/locationStatus';
import { getCrowdStatus } from '../utils/campusFeatures';

function Stars({ rating }) {
  const value = Number.isFinite(rating) ? rating : 0;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Rating ${value} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden="true" className={index < Math.round(value) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}>★</span>
      ))}
      <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-[3px]">{value}</span>
    </span>
  );
}

function MobileLocationCard({ location, selected, onSelect }) {
  if (!location) return null;
  const category = CAT[location.category] || {};
  const Icon = category.icon || MapPin;
  const tags = Array.isArray(location.tags) ? location.tags : [];
  const canteenOpen = location.category === 'food' ? isLocationOpen(location) : null;
  const crowdStatus = ['academic', 'food'].includes(location.category) ? getCrowdStatus(location) : null;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(location)}
      aria-label={`Show ${location.name || 'location'} on map`}
      aria-pressed={selected}
      className={`w-full text-left block p-3 rounded-xl mb-2 border transition-colors ${selected ? 'border-blue-400 bg-blue-50/70 dark:border-blue-500/40 dark:bg-white/10' : 'border-slate-200 bg-white/60 dark:border-white/5 dark:bg-white/5'}`}
    >
      <div className="flex items-start gap-2.5">
        <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border" style={{ backgroundColor: `${category.color || '#64748b'}15`, borderColor: `${category.color || '#64748b'}30` }}>
          <Icon aria-hidden="true" size={15} color={category.color || '#64748b'} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <p className="m-0 text-[12.5px] font-semibold text-slate-800 dark:text-slate-100 truncate">{location.name || 'Unnamed location'}</p>
            <ChevronRight aria-hidden="true" size={13} className="shrink-0 text-slate-400" />
          </div>
          {canteenOpen !== null && <span className={`inline-flex mt-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${canteenOpen ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}>{canteenOpen ? 'Open now' : 'Closed now'}</span>}
          {crowdStatus && <span className={`inline-flex mt-1 ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${crowdStatus.tone === 'red' ? 'bg-red-100 text-red-700' : crowdStatus.tone === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{crowdStatus.label}</span>}
          <Stars rating={location.rating} />
          <p className="m-0 mt-1 text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Clock aria-hidden="true" size={10} /> {location.timing || 'Timing unavailable'}
          </p>
          {tags.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{tags.map((tag) => <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">{tag}</span>)}</div>}
        </div>
      </div>
    </button>
  );
}

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
          <MobileLocationCard key={location.id} location={location} selected={selected?.id === location.id} onSelect={onSelect} />
        ))}
      </div>
    </aside>
  );
}
