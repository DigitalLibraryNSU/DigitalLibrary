import { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import rootStore from './RootStore';

const StoreContext = createContext(rootStore);

interface StoreProviderProps {
    children: ReactNode; // Тип для любых React-элементов
}

export const StoreProvider = ({ children }: StoreProviderProps) => (
    <StoreContext.Provider value={rootStore}>
        {children}
    </StoreContext.Provider>
);

export const useStore = () => useContext(StoreContext);
