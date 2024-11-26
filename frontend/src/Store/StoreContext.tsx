import { createContext, useContext } from 'react';
import rootStore from './RootStore';

const StoreContext = createContext(rootStore);

export const StoreProvider = ({ children }) => (
    <StoreContext.Provider value={rootStore}>
        {children}
    </StoreContext.Provider>
);

export const useStore = () => useContext(StoreContext);
