import { MapPin } from 'lucide-react';
import { LocationFilters } from '../LocationFilters';
import { TimetableWidget } from '../TimetableWidget';
import { CampusFeaturePanel } from '../CampusFeaturePanel';
import { LocationCard } from '../cards/LocationCard';

export function LocationSidebar({ locations, allLocations, selected, onSelect, query, onQueryChange, tab, onTabChange, tabs, categories, featureProps }) {
  return <aside className="flex w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white/80 dark:border-white/5 dark:bg-[#070a14]/88 max-[640px]:hidden"><LocationFilters query={query} onQueryChange={onQueryChange} onClearQuery={() => onQueryChange('')} tab={tab} onTabChange={onTabChange} tabs={tabs} categories={categories} resultCount={locations.length} /><TimetableWidget locations={allLocations} onSelect={onSelect} /><CampusFeaturePanel {...featureProps} /><div id="location-list" className="flex-1 overflow-y-auto px-2 pb-2">{locations.length === 0 ? <div className="py-10 text-center"><MapPin size={28} className="mx-auto mb-2 text-slate-300" /><p className="m-0 text-[13px]">No locations found</p></div> : locations.map((location) => <LocationCard key={location.id} location={location} selected={selected?.id === location.id} onSelect={onSelect} />)}</div><div className="border-t border-slate-200 p-2.5 text-center text-[10px] text-slate-400">Thapar Institute of Engineering &amp; Technology</div></aside>;
}
