import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import './toggle-theme.styles.css';

const ToggleTheme = () => {
    const [themeValue, setThemeValue] = useState(
        localStorage.getItem('theme') || 'light'
    );

    // Function to toggle theme
    const toggleTheme = () => {
        const newTheme = themeValue === 'light' ? 'dark' : 'light';
        setThemeValue(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // Set initial theme when component mounts
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', themeValue);
    }, [themeValue]);

    return (
        <button 
            className="theme-toggle" 
            onClick={toggleTheme}
        >
            <FontAwesomeIcon icon={themeValue === 'light' ? faMoon : faSun } />
        </button>
    );
};

export default ToggleTheme;