import { GraduationCap, Home, Utensils, Dumbbell, Shield, MapPin, Printer } from 'lucide-react';

export const CAT = {
  academic: { label: 'Academic', color: '#60a5fa', glow: 'rgba(96,165,250,0.5)', icon: GraduationCap },
  hostel: { label: 'Hostel', color: '#a78bfa', glow: 'rgba(167,139,250,0.5)', icon: Home },
  food: { label: 'Food', color: '#fbbf24', glow: 'rgba(251,191,36,0.5)', icon: Utensils },
  recreation: { label: 'Recreation', color: '#34d399', glow: 'rgba(52,211,153,0.5)', icon: Dumbbell },
  facility: { label: 'Facility', color: '#f87171', glow: 'rgba(248,113,113,0.5)', icon: Shield },
  stationery: { label: 'Print & Stationery', color: '#f97316', glow: 'rgba(249,115,22,0.5)', icon: Printer },
};

export const TABS = [
  { id: 'all', label: 'All', icon: MapPin },
  { id: 'academic', label: 'Academic', icon: GraduationCap },
  { id: 'hostel', label: 'Hostel', icon: Home },
  { id: 'food', label: 'Food', icon: Utensils },
  { id: 'recreation', label: 'Recreation', icon: Dumbbell },
  { id: 'facility', label: 'Facilities', icon: Shield },
  { id: 'stationery', label: 'Print & Stationery', icon: Printer },
];
