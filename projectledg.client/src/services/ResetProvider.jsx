import { createContext, useContext, useState, useEffect } from 'react';

// Create a Reset Context
const ResetContext = createContext();

export const useReset = () => useContext(ResetContext);

export const ResetProvider = ({ children }) => {
    const [reset, setReset] = useState(false);

    const triggerReset = () => {
        setReset(true);
        setTimeout(() => setReset(false), 0); // Reset the flag after all components reset
    };

    return (
        <ResetContext.Provider value={{ reset, triggerReset }}>
            {children}
        </ResetContext.Provider>
    );
};
