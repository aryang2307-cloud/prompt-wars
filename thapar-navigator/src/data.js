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

export const LOCATIONS = [
  // --- ACADEMIC BLOCKS & DEPARTMENTS ---
  { id: 1, name: 'Main Building & Administrative Block', shortName: 'Admin', category: 'academic', lat: 30.354987396581166, lng: 76.36990132336798, description: 'Central administrative offices and directorate.', rating: 4.8, timing: '9AM - 5PM', tags: ['Admin'] },
  { id: 2, name: 'C-Block (Civil & Mechanical)', shortName: 'C-Block', category: 'academic', lat: 30.353586404594573, lng: 76.37130970699148, description: 'Engineering lecture halls and structural labs.', rating: 4.5, timing: '8AM - 6PM', tags: ['Civil', 'Mechanical'] },
  { id: 3, name: 'E-Block (Electrical & ECE)', shortName: 'E-Block', category: 'academic', lat: 30.35360328413548, lng: 76.37246379912739, description: 'Electrical and communication engineering labs.', rating: 4.5, timing: '8AM - 6PM', tags: ['Electrical', 'ECE'] },
  { id: 4, name: 'F-Block', shortName: 'F-Block', category: 'academic', lat: 30.35405903063962, lng: 76.37206280101238, description: 'Lecture theaters and general classes.', rating: 4.4, timing: '8AM - 6PM', tags: ['Classes'] },
  { id: 5, name: 'Nava Nalanda Central Library', shortName: 'Library', category: 'academic', lat: 30.35432431772888, lng: 76.36957527732085, description: 'Multi-story central library and digital resource hub.', rating: 4.9, timing: '24 Hours', tags: ['Library', 'Study'] },
  { id: 50, name: 'G-Block', shortName: 'G-Block', category: 'academic', lat: 30.354694, lng: 76.369832, description: 'Academic block adjoining the central library complex.', rating: 4.6, timing: '8AM - 6PM', tags: ['Classes', 'Lecture Halls'] },
  { id: 6, name: 'CSED (Computer Science Department)', shortName: 'CSED', category: 'academic', lat: 30.355012715531565, lng: 76.36983286028233, description: 'Computer science labs, servers, and faculty offices.', rating: 4.7, timing: '9AM - 5PM', tags: ['CS', 'Labs'] },
  { id: 7, name: 'Chemical & Biotechnology Block', shortName: 'Chem/Biotech', category: 'academic', lat: 30.353130655891547, lng: 76.37103585462741, description: 'Biotech and chemical research facilities.', rating: 4.4, timing: '8AM - 6PM', tags: ['Chemical', 'Biotech'] },
  { id: 9, name: 'Thapar School of Liberal Arts & Sciences (TSLAS)', shortName: 'TSLAS', category: 'academic', lat: 30.3563630499533, lng: 76.37210192278482, description: 'Liberal arts block.', rating: 4.6, timing: '9AM - 5PM', tags: ['Liberal Arts'] },
  { id: 10, name: 'Central Workshop', shortName: 'Workshop', category: 'academic', lat: 30.354616051274284, lng: 76.37083046535426, description: 'Manufacturing shops and team labs.', rating: 4.7, timing: '8AM - 5PM', tags: ['Workshop'] },
  { id: 51, name: 'Campus Print & Stationery Hub', shortName: 'Print Hub', category: 'stationery', lat: 30.35488, lng: 76.36942, description: 'Photocopying, printing, binding, and submission supplies.', rating: 4.5, timing: '8AM - 7PM', tags: ['Printing', 'Photocopy', 'Stationery'] },

  // --- HOSTELS (BOYS & GIRLS HALLS) ---
  { id: 11, name: 'Agira Hall (Hostel A)', shortName: 'Agira', category: 'hostel', lat: 30.351855424193428, lng: 76.36453844002664, description: 'Student residential hall.', rating: 4.2, timing: '24 Hours', tags: ['Hostel'] },
  { id: 12, name: 'Amritam Hall (Hostel B)', shortName: 'Amritam', category: 'hostel', lat: 30.351492180475272, lng: 76.36317237931158, description: 'Student residential hall.', rating: 4.1, timing: '24 Hours', tags: ['Hostel'] },
  { id: 13, name: 'Prithvi Hall (Hostel C)', shortName: 'Prithvi', category: 'hostel', lat: 30.35138252172935, lng: 76.36117094151977, description: 'Student residential hall.', rating: 4.0, timing: '24 Hours', tags: ['Hostel'] },
  { id: 14, name: 'Neeram Hall (Hostel D)', shortName: 'Neeram', category: 'hostel', lat: 30.35103983735619, lng: 76.3600272627816, description: 'Student residential hall.', rating: 4.0, timing: '24 Hours', tags: ['Hostel'] },
  { id: 15, name: 'Vyan Hall (Hostel H)', shortName: 'Vyan', category: 'hostel', lat: 30.35289031871346, lng: 76.3645066711728, description: 'Student residential hall.', rating: 4.3, timing: '24 Hours', tags: ['Hostel'] },
  { id: 16, name: 'Ira Hall (Hostel I)', shortName: 'Ira', category: 'hostel', lat: 30.355056, lng: 76.367509, description: 'Student residential hall.', rating: 4.5, timing: '24 Hours', tags: ['Hostel'] },
  { id: 17, name: 'Tejas Hall (Hostel J)', shortName: 'Tejas', category: 'hostel', lat: 30.352897172294057, lng: 76.36325180144722, description: 'Student residential hall.', rating: 4.6, timing: '24 Hours', tags: ['Hostel'] },
  { id: 18, name: 'Ambaram Hall (Hostel K)', shortName: 'Ambaram', category: 'hostel', lat: 30.357235385587373, lng: 76.36356154776846, description: 'Student residential hall.', rating: 4.4, timing: '24 Hours', tags: ['Hostel'] },
  { id: 19, name: 'Viyat Hall (Hostel L)', shortName: 'Viyat', category: 'hostel', lat: 30.35740671708874, lng: 76.36630955365808, description: 'Student residential hall near 400m track.', rating: 4.5, timing: '24 Hours', tags: ['Hostel'] },
  { id: 20, name: 'Anantam Hall (Hostel M)', shortName: 'Anantam', category: 'hostel', lat: 30.352698418583515, lng: 76.3608135418867, description: 'Student residential hall.', rating: 4.6, timing: '24 Hours', tags: ['Hostel'] },
  { id: 21, name: 'Ananta Hall (Hostel N)', shortName: 'Ananta', category: 'hostel', lat: 30.354329557832866, lng: 76.36755648116355, description: 'Student residential hall.', rating: 4.8, timing: '24 Hours', tags: ['Hostel'] },
  { id: 22, name: 'Vyom Hall (Hostel O)', shortName: 'Vyom', category: 'hostel', lat: 30.351327692298263, lng: 76.36228285140068, description: 'Student residential hall.', rating: 4.7, timing: '24 Hours', tags: ['Hostel'] },
  { id: 23, name: 'Dhriti Hall', shortName: 'Dhriti', category: 'hostel', lat: 30.351810153187092, lng: 76.36659525097004, description: 'Student residential hall.', rating: 4.5, timing: '24 Hours', tags: ['Hostel'] },
  { id: 24, name: 'Vahni Hall (Hostel Q)', shortName: 'Vahni', category: 'hostel', lat: 30.352091152249454, lng: 76.36766744978708, description: 'Student residential hall.', rating: 4.3, timing: '24 Hours', tags: ['Hostel'] },
  { id: 25, name: 'Pavani Hall', shortName: 'Pavani', category: 'hostel', lat: 30.351796445895115, lng: 76.36583279847791, description: 'Student residential hall.', rating: 4.4, timing: '24 Hours', tags: ['Hostel'] },
  { id: 42, name: 'Hostel G', shortName: 'Hostel G', category: 'hostel', lat: 30.354446830091177, lng: 76.36663195451949, description: 'Student residential hall.', rating: 4.4, timing: '24 Hours', tags: ['Hostel'] },
  { id: 43, name: 'Hostel E', shortName: 'Hostel E', category: 'hostel', lat: 30.3552143171341, lng: 76.36669866063332, description: 'Student residential hall.', rating: 4.4, timing: '24 Hours', tags: ['Hostel'] },

  // --- FOOD, CANTEENS & COMMERCIAL HUBS ---
  { id: 28, name: 'COS Complex (Centre of Science)', shortName: 'COS', category: 'food', lat: 30.354151801481002, lng: 76.36228835918133, description: 'Primary food hub, cafes, and juice bars.', rating: 4.8, timing: '8AM - 8PM', tags: ['Food', 'Shops'] },
  { id: 44, name: 'Kravings', shortName: 'Kravings', category: 'food', lat: 30.353620781769585, lng: 76.36678103233044, description: 'Popular campus eatery and hangout spot.', rating: 4.6, timing: '10AM - 10PM', tags: ['Food', 'Hangout'] },
  { id: 30, name: 'Nescafe Outlets', shortName: 'Nescafe', category: 'food', lat: 30.35276074267857, lng: 76.37005432239691, description: 'Quick beverage and snack spots.', rating: 4.5, timing: '8AM - 8PM', tags: ['Coffee', 'Snacks'] },
  { id: 52, name: 'COS Photocopy & Supplies', shortName: 'COS Copy Shop', category: 'stationery', lat: 30.35402, lng: 76.36254, description: 'Convenient photocopy and stationery counter near COS Complex.', rating: 4.3, timing: '9AM - 8PM', tags: ['Printing', 'Photocopy', 'Supplies'] },

  // --- SPORTS & RECREATION ---
  { id: 34, name: 'Olympiad Sized Swimming Pool', shortName: 'Pool', category: 'recreation', lat: 30.3545364041414, lng: 76.365897481828, description: 'Campus swimming pool facility.', rating: 4.7, timing: '6AM - 8PM', tags: ['Sports', 'Pool'] },
  { id: 35, name: 'Main Sports Stadium & 400m Track', shortName: 'Stadium', category: 'recreation', lat: 30.354441446268485, lng: 76.36110554483386, description: 'Football ground, cricket pitch, and running track.', rating: 4.8, timing: '6AM - 9PM', tags: ['Sports', 'Track'] },
  { id: 45, name: 'Cricket Ground', shortName: 'Cricket', category: 'recreation', lat: 30.35587165929884, lng: 76.3634467302112, description: 'Main cricket field and practice nets.', rating: 4.6, timing: '6AM - 9PM', tags: ['Sports', 'Cricket'] },
  { id: 36, name: 'Tennis & Basketball Courts', shortName: 'Courts', category: 'recreation', lat: 30.355197093161003, lng: 76.36481355987785, description: 'Outdoor synthetic courts.', rating: 4.5, timing: '6AM - 9PM', tags: ['Sports', 'Courts'] },

  // --- AMENITIES, MEDICAL & LANDMARKS ---
  { id: 37, name: 'Main Gate Security Post', shortName: 'Gate', category: 'facility', lat: 30.35247033254123, lng: 76.37337917176376, description: 'Primary security checkpoint.', rating: 4.3, timing: '24 Hours', tags: ['Security', 'Entry'] },
  { id: 38, name: 'Dispensary / Health Centre', shortName: 'Dispensary', category: 'facility', lat: 30.35597586110557, lng: 76.3686731466856, description: '24x7 medical assistance.', rating: 4.5, timing: '24 Hours', tags: ['Medical'] },
  { id: 39, name: 'Tan Audi (Auditorium)', shortName: 'Auditorium', category: 'facility', lat: 30.35371671877089, lng: 76.36846350877244, description: 'Main venue for cultural fests and major events.', rating: 4.8, timing: 'Event-based', tags: ['Events'] },
  { id: 46, name: 'Nirvana Park', shortName: 'Nirvana', category: 'facility', lat: 30.352847879374597, lng: 76.36685430824126, description: 'Scenic green park and leisure spot.', rating: 4.7, timing: '24 Hours', tags: ['Park', 'Relax'] },
  { id: 47, name: 'Shiv Temple', shortName: 'Temple', category: 'facility', lat: 30.35270575767332, lng: 76.36268331579276, description: 'On-campus temple landmark.', rating: 4.9, timing: '24 Hours', tags: ['Temple', 'Landmark'] },
  { id: 48, name: 'Gurudwara', shortName: 'Gurudwara', category: 'facility', lat: 30.35234758861929, lng: 76.36249802103212, description: 'On-campus gurudwara landmark.', rating: 4.9, timing: '24 Hours', tags: ['Gurudwara', 'Landmark'] },
  { id: 49, name: 'Fete Area', shortName: 'Fete Area', category: 'facility', lat: 30.35422156580039, lng: 76.36357273064843, description: 'Event and fest ground.', rating: 4.6, timing: 'Event-based', tags: ['Events'] },
  { id: 41, name: 'Guest House', shortName: 'Guest House', category: 'facility', lat: 30.352054790144333, lng: 76.36923349296787, description: 'Accommodation for visitors and delegates.', rating: 4.5, timing: '24 Hours', tags: ['Guest'] },
  { id: 40, name: 'Bank & ATM Complex (SBI / ICICI)', shortName: 'Bank', category: 'facility', lat: 30.35279465543156, lng: 76.37038344282831, description: 'On-banking and ATM services.', rating: 4.2, timing: '10AM - 4PM', tags: ['Bank', 'ATM'] }
];
