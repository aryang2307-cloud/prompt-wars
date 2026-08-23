import { Clock, Utensils, X } from 'lucide-react';
import { getMessCountdown, getMessMenu } from '../utils/messMenu';
import { useEffect, useState } from 'react';

export function MessMenuDrawer({ hostel, onClose }) {
  const [now, setNow] = useState(null);
  const menu = now ? getMessMenu(new Date(now)) : { day: 'Today', meals: [], closesAt: 22 };

  useEffect(() => {
    const initialTick = setTimeout(() => setNow(Date.now()), 0);
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => {
      clearTimeout(initialTick);
      clearInterval(timer);
    };
  }, []);

  if (!hostel) return null;
  const currentTime = now ? new Date(now) : null;

  return (
    <section className="absolute inset-x-3 bottom-3 z-[1002] max-h-[min(62vh,420px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0f1423]/95" aria-labelledby="mess-menu-title">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="m-0 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hostel mess</p>
          <h2 id="mess-menu-title" className="m-0 text-base font-bold text-slate-900 dark:text-slate-100">{hostel.name}</h2>
          <p className="m-0 mt-1 flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300"><Clock aria-hidden="true" size={12} /> Closes at 10:00 PM · {currentTime ? getMessCountdown(menu.closesAt, currentTime) : 'Updating'}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close hostel mess menu" className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"><X aria-hidden="true" size={15} /></button>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {menu.meals.map(([meal, items]) => (
          <div key={meal} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-white/10 dark:bg-white/5">
            <p className="m-0 flex items-center gap-1 text-[11px] font-semibold text-slate-800 dark:text-slate-100"><Utensils aria-hidden="true" size={12} /> {meal}</p>
            <p className="m-0 mt-1 text-[10.5px] leading-relaxed text-slate-600 dark:text-slate-300">{items}</p>
          </div>
        ))}
      </div>
      <p className="m-0 mt-2 text-[10px] text-slate-500 dark:text-slate-400">{menu.day} menu · Check with the hostel office for changes.</p>
    </section>
  );
}
