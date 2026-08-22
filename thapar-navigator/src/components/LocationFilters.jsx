import { Search, X } from 'lucide-react';

/**
 * Render the search field and category filter tabs for campus locations.
 *
 * @param {Object} props - Filter state and available category tabs.
 * @returns {JSX.Element} The location filter controls.
 */
export function LocationFilters({ query, onQueryChange, onClearQuery, tab, onTabChange, tabs, categories, resultCount }) {
  return (
    <>
      <div className="p-3 pb-1.5">
        <div className="relative">
          <Search aria-hidden="true" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            id="location-search"
            type="search"
            aria-label="Search campus locations"
            placeholder="Search COS, Library, Mess..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="w-full py-2.5 pr-8 pl-8 rounded-xl outline-none bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-[12.5px] transition-colors focus:border-blue-400 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-[#0c101e]"
          />
          {query && (
            <button onClick={onClearQuery} aria-label="Clear location search" className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex">
              <X aria-hidden="true" size={13} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
            </button>
          )}
        </div>
      </div>

      <div className="px-2.5 pb-2 flex gap-1 overflow-x-auto shrink-0 scrollbar-hide" role="tablist" aria-label="Filter locations by category">
        {tabs.map((filterTab) => {
          const Icon = filterTab.icon;
          const active = tab === filterTab.id;
          const category = categories[filterTab.id];
          return (
            <button
              key={filterTab.id}
              onClick={() => onTabChange(filterTab.id)}
              role="tab"
              aria-label={`Show ${filterTab.label.toLowerCase()} locations`}
              aria-selected={active}
              className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer outline-none transition-all ${
                active
                  ? 'bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-100 shadow-sm'
                  : 'bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
              style={active && category ? { backgroundColor: `${category.color}25`, color: category.color, border: `1px solid ${category.color}40` } : { border: '1px solid transparent' }}
            >
              <Icon aria-hidden="true" size={11} />{filterTab.label}
            </button>
          );
        })}
      </div>

      <div className="px-3.5 pb-1.5">
        <p className="m-0 text-[10.5px] text-slate-500 dark:text-slate-400" aria-live="polite">
          {resultCount} location{resultCount !== 1 ? 's' : ''}
          {query && <span className="text-slate-700 dark:text-slate-300"> &middot; &ldquo;{query}&rdquo;</span>}
        </p>
      </div>
    </>
  );
}
