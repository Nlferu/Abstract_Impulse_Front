import { ConnectButton } from "web3uikit"
import Link from "next/link"
import styles from '@/styles/Header.module.css'
import { useState, useEffect, useLayoutEffect } from "react"
import MenuButton from './MenuButton'

export default function Header() {
    const [isDesktopView, setIsDesktopView] = useState(null)

    useLayoutEffect(() => {
        function updateSize() {
            setIsDesktopView(window.innerWidth > 600)
        }

        window.addEventListener('resize', updateSize)
        updateSize() // Call this function immediately to update state with initial window size.

        return () => window.removeEventListener('resize', updateSize)
    }, [])

    if (isDesktopView === null) return null

    return (
        <header className={styles.header}>
            <nav className={styles.navigationBar}>
                <Link href="/">
                    <h1 className={styles.headerOne}>ABSTRACT IMPULSE NFT</h1>
                </Link>
                <div className={styles.navObj}>
                    {isDesktopView && (
                        <div>
                            <Link href="/" className={styles.homeButton}>
                                <span>HOME</span>
                            </Link>
                            <Link href="/withdraw" className={styles.homeButton}>
                                <span>Withdraw</span>
                            </Link>
                            <Link href="/about" className={styles.homeButton}>
                                <span>About</span>
                            </Link>
                        </div>
                    )}
                    <div className={styles.connButton}>
                        <ConnectButton
                            moralisAuth={false}
                        />
                    </div>
                    {!isDesktopView && (
                        <div className={styles.menuButton}>
                            <MenuButton
                                key={setIsDesktopView}
                                isSmartphoneViewEnabled={setIsDesktopView}
                            />
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}


