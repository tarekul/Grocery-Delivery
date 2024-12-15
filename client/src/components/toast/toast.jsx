import React, { useEffect } from 'react';
import './toast.styles.css';

const Toast = ({ message, onClose, color }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast ${color}`}>
            {message}
        </div>
    );
};

export default Toast;
