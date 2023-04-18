import React from 'react';
import styles from '@/styles/BlackoutLayer.module.css'

const BlackoutLayer = ({ children }) => (

    <div className={styles.blackoutLayer}>
        {children}
        <div className={styles.blackoutText}>
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
            </div>
            <p>Transaction is being processed!</p>
            <p>Website will be refreshed automatically in 30 seconds, please wait
                <span className={styles.dotAnimation}>.</span>
                <span className={styles.dotAnimation}>.</span>
                <span className={styles.dotAnimation}>.</span></p>
        </div>
    </div >
)

export default BlackoutLayer