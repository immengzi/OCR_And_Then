"use client";
import {createContext, useContext, useState} from "react";

const CurrentUserContext = createContext(null);

export const CurrentUserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);

    return (
        <CurrentUserContext.Provider value={{currentUser, setCurrentUser}}>
            {children}
        </CurrentUserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(CurrentUserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}