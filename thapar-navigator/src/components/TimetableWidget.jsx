import { Navigation, School } from 'lucide-react';

export function TimetableWidget({ locations = [], onSelect }) {
  const lectureHalls = (Array.isArray(locations) ? locations : []).filter((location) => location?.category === 'academic');

  return (
    <form
      className="mx-3 mb-2 rounded-xl border border-slate-200 bg-white/60 p-2.5 dark:border-white/10 dark:bg-white/5"
      onSubmit={(event) => {
        event.preventDefault();
        const location = lectureHalls.find((item) => item.id === Number(event.currentTarget.elements.hall.value));
        if (location) onSelect?.(location);
      }}
    >
      <label htmlFor="lecture-hall" className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <School aria-hidden="true" size={12} /> Classroom &amp; hall locator
      </label>
      <div className="flex gap-1.5">
        <select id="lecture-hall" name="hall" defaultValue="" aria-label="Select a classroom, lab, or exam venue" className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 outline-none focus:border-blue-400 dark:border-white/10 dark:bg-[#0c101e] dark:text-slate-200">
          <option value="" disabled>Select classroom or hall</option>
          {lectureHalls.map((location) => <option key={location.id} value={location.id}>{location.shortName || location.name}</option>)}
        </select>
        <button type="submit" aria-label="Show directions to selected lecture hall" className="flex shrink-0 items-center justify-center rounded-lg bg-blue-500 px-3 text-white transition hover:bg-blue-600 disabled:cursor-not-allowed" disabled={lectureHalls.length === 0}>
          <Navigation aria-hidden="true" size={14} />
        </button>
      </div>
      {lectureHalls.length === 0 && <p className="m-0 mt-1 text-[10px] text-slate-500">Lecture halls unavailable</p>}
    </form>
  );
}
