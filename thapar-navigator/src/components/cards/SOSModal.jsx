import { useEffect, useRef } from 'react';
import { AlertTriangle, MapPin, Phone, X } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../../data/contacts';

/** Focus the modal on open and close it when Escape is pressed. */
export function SOSModal({ onClose, onLocateDispensary }) {
  const closeButtonRef = useRef(null);
  useEffect(() => {
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleLocate = () => {
    onLocateDispensary?.();
    onClose();
  };

  return <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/80 p-5"><div className="fade-slide-in max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-red-500/30 bg-white shadow-md dark:bg-[#0f1423]" role="dialog" aria-modal="true" aria-labelledby="sos-title"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-[#0f1423]"><div className="flex items-center gap-3.5"><AlertTriangle size={24} className="text-red-500" /><div><h2 id="sos-title" className="m-0 text-[22px] font-bold">Emergency SOS</h2><p className="m-0 text-[13.5px] text-slate-600 dark:text-slate-400">Tap any number below to call instantly</p></div></div><button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close emergency contacts" className="rounded-full border-0 bg-slate-100 p-2.5 text-slate-500 dark:bg-slate-800 dark:text-slate-400"><X size={20} /></button></div><div className="p-6 max-[640px]:p-4">{EMERGENCY_CONTACTS.map((section) => <div key={section.category} className="mb-7"><h3 className="m-0 mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">{section.category}</h3><div className="grid gap-3.5 sm:grid-cols-2">{section.contacts.map((contact) => <a key={contact.name} href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} aria-label={`Call ${contact.name} at ${contact.phone}`} className="flex items-center gap-3.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 no-underline transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"><Phone size={18} className="shrink-0 text-red-500" /><div className="min-w-0"><p className="m-0 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{contact.name}</p><p className="m-0 text-[13px] font-medium text-red-500">{contact.phone}</p><p className="m-0 truncate text-[11px] text-slate-600 dark:text-slate-400">{contact.description}</p></div></a>)}</div></div>)}<button type="button" onClick={handleLocate} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"><MapPin size={16} /> Locate Dispensary on Map</button></div></div></div>;
}
