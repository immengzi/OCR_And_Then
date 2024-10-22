"use client";
import {createContext, useContext, useState} from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({theme, children}) => {
    const [currentTheme, setTheme] = useState(theme);

    const themeSwitchHandler = (newTheme) => {
        setTheme(newTheme);
        document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme: currentTheme,
                toggleTheme: themeSwitchHandler
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};