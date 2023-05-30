import React from 'react'
import styles from '@/styles/BlockingLayer.module.css'

const BlockingLayer = ({ children }) => (
    <div className={styles.blockingLayer}>
        {children}
    </div>
)

export default BlockingLayer