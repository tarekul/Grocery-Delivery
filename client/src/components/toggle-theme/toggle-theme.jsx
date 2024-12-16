import { useState } from 'react';
import './toggle-theme.styles.css';

const ToggleTheme = () => {
    const theme = localStorage.getItem('theme')
    const [themeValue, setThemeValue] = useState(theme || 'light');
    console.log(themeValue);

    return (
        <button className={`theme-button ${themeValue}`} onClick={() => setThemeValue(themeValue === 'light' ? 'dark' : 'light')}>{themeValue === 'light' ? '🌙':'☀️' }</button>
    )
}

export default ToggleTheme;