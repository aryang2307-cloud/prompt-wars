import { createContext, useContext } from 'react';

export const MapContext = createContext({});
export const FilterContext = createContext({});

export const useMapContext = () => useContext(MapContext);
export const useFilterContext = () => useContext(FilterContext);
