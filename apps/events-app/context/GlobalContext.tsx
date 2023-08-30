
import React, { createContext, useContext, ReactElement } from 'react';

interface GlobalContextType {
    isAuth: boolean;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
};


type GlobalProviderProps = {
    children: ReactElement;
    user: any
}




export const GlobalProvider = ({ children, user }: GlobalProviderProps) => {
    const isAuthenticated = user ? true : false

    return (
        <GlobalContext.Provider value={{ isAuthenticated, user }}>
            {children}
        </GlobalContext.Provider>
    );
};


export default GlobalProvider