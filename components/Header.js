import { ConnectButton } from "web3uikit"
import Link from "next/link"
import styles from '@/styles/Header.module.css'


export default function Header() {

    return (
        <header className={styles.header}>
            <nav className={styles.navigationBar}>
                <h1 className={styles.headerOne}>ABSTRACT IMPULSE NFT</h1>
                <div className={styles.navObj}>
                    <Link href="/" className={styles.homeButton}>
                        HOME
                    </Link>
                    <Link href="/withdraw" className={styles.homeButton}>
                        Withdraw
                    </Link>
                    <Link href="/about" className={styles.homeButton}>
                        About
                    </Link>
                    <div className={styles.connButton}>
                        <ConnectButton moralisAuth={false} />
                    </div>
                </div>
            </nav>
        </header>
    )
}


