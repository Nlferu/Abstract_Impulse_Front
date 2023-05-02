import styles from '@/styles/Withdraw.module.css'
import { useState } from 'react'
import WithdrawModal from '../../components/WithdrawModal'
import BlockingLayer from "../../components/BlockingLayer"
import BlackoutLayer from "../../components/BlackoutLayer"


export default function Withdraw() {
    const [isTransactionOpen, setIsTransactionOpen] = useState(false)

    return (
        <div className={styles.container}>
            {isTransactionOpen && (<BlackoutLayer />)}
            <BlockingLayer />
            <WithdrawModal
                key={setIsTransactionOpen}
                isTransactionOpen={setIsTransactionOpen}
            />
        </div>
    )
}