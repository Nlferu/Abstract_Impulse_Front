
import styles from '@/styles/Unsupported.module.css'

export default function Unsupported() {
    return (
        <div className={styles.smartphoneVersion}>
            <p className={styles.msgTxtTitle}>You are using unsupported browser.</p>
            <p className={styles.msgTxt}>Please use Google Chrome on your device.</p>
        </div>
    )
}