import { BookOpen, Copy, Moon, Radio, Sun, TentTree } from 'lucide-react';

export function CampusFeaturePanel({ shadeMode, onShadeChange, eventMode, onEventChange, nightMode, onNightChange, quietMode, onQuietChange, wifiMode, onWifiChange, onCopyDelivery, copied }) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-3 pb-2">
      <button type="button" onClick={() => onShadeChange?.(!shadeMode)} aria-pressed={shadeMode} className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${shadeMode ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' : 'border-slate-200 text-slate-500 dark:border-white/10 dark:text-slate-400'}`}>
        {shadeMode ? <Sun aria-hidden="true" size={13} /> : <Moon aria-hidden="true" size={13} />} Shade routes
      </button>
      <button type="button" onClick={() => onEventChange?.(!eventMode)} aria-pressed={eventMode} className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${eventMode ? 'border-fuchsia-400 bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300' : 'border-slate-200 text-slate-500 dark:border-white/10 dark:text-slate-400'}`}>
        <TentTree aria-hidden="true" size={13} /> {eventMode ? 'Fest mode on' : 'Fest mode'}
      </button>
      <button type="button" onClick={() => onNightChange?.(!nightMode)} aria-pressed={nightMode} className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${nightMode ? 'border-indigo-400 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300' : 'border-slate-200 text-slate-500 dark:border-white/10 dark:text-slate-400'}`}>
        <BookOpen aria-hidden="true" size={13} /> {nightMode ? 'Night filter on' : 'Night filter'}
      </button>
      <button type="button" onClick={() => onQuietChange?.(!quietMode)} aria-pressed={quietMode} className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${quietMode ? 'border-teal-400 bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300' : 'border-slate-200 text-slate-500 dark:border-white/10 dark:text-slate-400'}`}>
        <BookOpen aria-hidden="true" size={13} /> {quietMode ? 'Quiet study on' : 'Quiet study'}
      </button>
      <button type="button" onClick={() => onWifiChange?.(!wifiMode)} aria-pressed={wifiMode} className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${wifiMode ? 'border-cyan-400 bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300' : 'border-slate-200 text-slate-500 dark:border-white/10 dark:text-slate-400'}`}>
        <Radio aria-hidden="true" size={13} /> {wifiMode ? 'Wi-Fi map on' : 'Wi-Fi map'}
      </button>
      {eventMode && <span className="basis-full text-[10px] text-fuchsia-700 dark:text-fuchsia-300">Saturnalia stage and Urja food stalls are highlighted on the map.</span>}
      <button type="button" onClick={onCopyDelivery} aria-label="Copy delivery instructions for the selected destination" className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
        <Copy aria-hidden="true" size={13} /> {copied ? 'Delivery link copied' : 'Copy delivery pin'}
      </button>
    </div>
  );
}
