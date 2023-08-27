import React from 'react';

interface GlobalContextType {
    isAuth: boolean;
}

const GlobalContext = React.createContext<GlobalContextType | undefined>(undefined);

export const useGlobal = () => {
    const context = React.useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
};


type GlobalProviderProps = {
    children: React.ReactElement;
    user: any
}




export const GlobalProvider = ({ children, user }: GlobalProviderProps) => {
    const isAuthenticated = user ? true : false

    return (
        <GlobalContext.Provider value={{ isAuthenticated }}>
            {children}
        </GlobalContext.Provider>
    );
};


export default GlobalProvider