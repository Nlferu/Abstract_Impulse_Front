import { ConnectButton } from "web3uikit"
import Link from "next/link"
import styles from '@/styles/Header.module.css'
import { useState, useEffect } from "react"
import MenuButton from './MenuButton'


export default function Header() {
    const [isDesktopView, setIsDesktopView] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsDesktopView(window.innerWidth > 600)
        }

        // Detect if window is not undefined (browser environment)
        if (typeof window !== 'undefined') {
            handleResize()
            window.addEventListener('resize', handleResize)

            return () => {
                window.removeEventListener('resize', handleResize)
            }
        }
    }, [])

    if (isDesktopView === null) return null

    return (
        <header className={styles.header}>
            <nav className={styles.navigationBar}>
                <h1 className={styles.headerOne}>ABSTRACT IMPULSE NFT</h1>
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
                        <ConnectButton moralisAuth={false} />
                    </div>
                    {!isDesktopView && (
                        <div>
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


