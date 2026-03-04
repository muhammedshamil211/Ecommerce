import React from 'react';
import styles from './Alert.module.css';

const Alert = ({ variant = 'info', children }) => {
    return (
        <div className={`${styles.alert} ${styles[variant]}`}>
            {children}
        </div>
    );
};

export default Alert;
