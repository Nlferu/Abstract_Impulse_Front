import React, { useState, useEffect } from 'react'
import styles from '@/styles/BlackoutLayer.module.css'

const BlackoutLayer = ({ children }) => {
    const [countdown, setCountdown] = useState(30)

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(countdown => (countdown > 0 ? countdown - 1 : 0))
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className={styles.blackoutLayer}>
            {children}
            <div className={styles.blackoutText}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                </div>
                <p>Transaction is being processed!</p>
                <p>Website will be refreshed automatically in {countdown} seconds, please wait
                    <span className={styles.dotAnimation1}>.</span>
                    <span className={styles.dotAnimation2}>.</span>
                    <span className={styles.dotAnimation3}>.</span>
                </p>
            </div>
        </div>
    )
}

export default BlackoutLayer
