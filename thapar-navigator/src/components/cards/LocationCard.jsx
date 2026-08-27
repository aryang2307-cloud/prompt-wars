import { ChevronRight, Clock, MapPin, Star } from 'lucide-react';
import { CAT } from '../../data';
import { isLocationOpen } from '../../utils/locationStatus';
import { getCrowdStatus } from '../../utils/campusFeatures';

function Stars({ rating }) {
  const value = Number.isFinite(rating) ? rating : 0;
  return <span className="inline-flex items-center gap-0.5" aria-label={`Rating ${value} out of 5`}>
    {Array.from({ length: 5 }, (_, index) => <Star key={index} aria-hidden="true" size={10} fill={index < Math.round(value) ? '#fbbf24' : 'none'} color={index < Math.round(value) ? '#fbbf24' : '#94a3b8'} />)}
    <span className="ml-[3px] text-[11px] text-slate-500 dark:text-slate-400">{value}</span>
  </span>;
}

export function LocationCard({ location, selected, onSelect }) {
  if (!location) return null;
  const category = CAT[location.category] || {};
  const Icon = category.icon || MapPin;
  const isOpen = location.category === 'food' ? isLocationOpen(location) : null;
  const crowd = ['academic', 'food'].includes(location.category) ? getCrowdStatus(location) : null;
  return <button type="button" id={`loc-card-${location.id}`} onClick={() => onSelect(location)} aria-label={`Show ${location.name} on map`} aria-pressed={selected} className={`mb-1.5 block w-full cursor-pointer rounded-xl border p-2.5 text-left outline-none transition-all ${selected ? 'border-slate-300 bg-slate-200/50 dark:border-white/20 dark:bg-white/10' : 'border-transparent bg-white/40 hover:bg-white/60 dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10'}`} style={selected ? { borderColor: `${category.color}40`, backgroundColor: `${category.color}15` } : {}}>
    <div className="flex items-start gap-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border" style={{ backgroundColor: `${category.color}15`, borderColor: `${category.color}30` }}><Icon aria-hidden="true" size={15} color={category.color} /></div>
      <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-1"><p className="m-0 truncate text-[12.5px] font-semibold text-slate-800 dark:text-slate-100">{location.name}</p><ChevronRight aria-hidden="true" size={13} className="shrink-0 text-slate-400 dark:text-slate-600" /></div>
        {isOpen !== null && <span className={`mt-1 inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{isOpen ? 'Open now' : 'Closed now'}</span>}
        {crowd && <span className={`ml-1 mt-1 inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${crowd.tone === 'red' ? 'bg-red-100 text-red-700' : crowd.tone === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{crowd.label}</span>}
        <Stars rating={location.rating} /><p className="m-0 mt-1 flex items-center gap-1 text-[10.5px] text-slate-500 dark:text-slate-400"><Clock aria-hidden="true" size={10} /> {location.timing}</p>
      </div>
    </div>
  </button>;
}
