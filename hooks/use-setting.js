import { createContext, useContext } from 'react';

export const SettingContext = createContext();

export function useSetting() {
    return useContext(SettingContext);
}
