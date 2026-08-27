import { Clock, Copy, MapPin, Star, X } from 'lucide-react';
import { CAT } from '../../data';

function Stars({ rating }) {
  const value = Number.isFinite(rating) ? rating : 0;
  return <span className="inline-flex items-center gap-0.5" aria-label={`Rating ${value} out of 5`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={10} aria-hidden="true" fill={index < Math.round(value) ? '#fbbf24' : 'none'} color={index < Math.round(value) ? '#fbbf24' : '#94a3b8'} />)}<span className="ml-[3px] text-[11px] text-slate-500">{value}</span></span>;
}

export function LocationDetails({ location, onClose, onOpenSOS, onCopyDelivery, deliveryCopied }) {
  if (!location) return null;
  const category = CAT[location.category] || {};
  const Icon = category.icon || MapPin;
  return <div id="detail-panel" className="fade-slide-in absolute bottom-4 right-4 z-[1001] w-[285px] rounded-[18px] border bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:bg-[#090d19]/95" style={{ borderColor: `${category.color}30` }}>
    <div className="mb-3 flex items-start justify-between"><div className="flex items-center gap-2.5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border" style={{ backgroundColor: `${category.color}15`, borderColor: `${category.color}35` }}><Icon size={18} color={category.color} /></div><div><p className="m-0 text-[13.5px] font-bold leading-tight text-slate-800 dark:text-slate-100">{location.name}</p><span className="rounded-full border px-2 py-0.5 text-[10px] font-medium" style={{ color: category.color }}>{category.label}</span></div></div><button type="button" onClick={onClose} aria-label={`Close details for ${location.name}`} className="rounded-md border-0 bg-transparent p-1 text-slate-400 hover:bg-slate-100"><X size={15} /></button></div>
    <p className="m-0 mb-3 text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-300">{location.description}</p><div className="mb-2.5 flex items-center justify-between"><span className="flex items-center gap-1 text-[11px] text-slate-500"><Clock size={11} /> {location.timing}</span><Stars rating={location.rating} /></div><div className="flex flex-wrap gap-1.5">{(location.tags || []).map((tag) => <span key={tag} className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600">{tag}</span>)}</div>
    {location.id === 38 && <button type="button" onClick={onOpenSOS} className="mt-3 w-full rounded-lg bg-red-500 px-3 py-2 text-[11px] font-semibold text-white">Emergency contacts</button>}
    {(location.category === 'food' || location.category === 'hostel') && <button type="button" onClick={onCopyDelivery} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700"><Copy size={12} /> {deliveryCopied ? 'Delivery link copied' : 'Copy delivery pin'}</button>}
  </div>;
}

export function PopupContent({ location }) {
  if (!location) return null;
  const category = CAT[location.category] || {};
  return <div aria-label={`Details for ${location.name}`}><p className="m-0 mb-1 font-bold text-[13px]">{location.name}</p><p className="m-0 mb-2 flex items-center gap-1 text-[11px] text-slate-500"><Clock size={10} /> {location.timing}</p><div className="flex flex-wrap gap-1">{(location.tags || []).slice(0, 3).map((tag) => <span key={tag} className="rounded-full border px-1.5 py-0.5 text-[10px]" style={{ color: category.color }}>{tag}</span>)}</div></div>;
}
