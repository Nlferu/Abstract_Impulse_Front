import { ConnectButton } from "web3uikit"
import Link from "next/link"
import styles from '@/styles/Header.module.css'
import { useState } from "react"


export default function Header() {

    return (
        <header className={styles.header}>
            <nav className={styles.navigationBar}>
                <h1 className={styles.headerOne}>ABSTRACT IMPULSE NFT</h1>
                <div className={styles.navObj}>
                    <Link href="/" className={styles.homeButton}>
                        <span>HOME</span>
                    </Link>
                    <Link href="/withdraw" className={styles.homeButton}>
                        <span>Withdraw</span>
                    </Link>
                    <Link href="/about" className={styles.homeButton}>
                        <span>About</span>
                    </Link>
                    <div className={styles.connButton}>
                        <ConnectButton moralisAuth={false} />
                    </div>
                </div>
            </nav>
        </header>
    )
}


