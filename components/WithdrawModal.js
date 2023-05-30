
import styles from '@/styles/Withdraw.module.css'
import { useWeb3Contract, useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import absImpAbi from "../constants/AbstractImpulseNFT.json"
import React, { useState } from 'react'
import { useNotification } from "web3uikit"


export default function WithdrawModal({ isTransactionOpen, bidToWithdraw }) {

    const { chainId, isWeb3Enabled, account } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : ''
    const absImpAddress = chainString ? networkMapping[chainString].AbstractImpulseNFT[0] : ''
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()
    const { failedWithdrawal, setFailedWithdrawal } = useState(true)
    const bidAmount = bidToWithdraw && bidToWithdraw[account] && bidToWithdraw[account].bidAmount ? bidToWithdraw[account].bidAmount : 0

    async function withdrawRejectedBids() {

        const withdrawPending = {
            abi: absImpAbi,
            contractAddress: absImpAddress,
            functionName: "withdrawPending",
            params: {},
        }

        await runContractFunction({
            params: withdrawPending,
            onError: () => handleBIDWithdrawError(),
            onSuccess: () => handleBIDWithdrawSuccess(),
            onError: (error) => setFailedWithdrawal(true),
        })

    }

    async function handleBIDWithdrawSuccess() {
        dispatch({
            type: "success",
            message: "BID will be shortly withdrawn to your account",
            title: "BID withdrawn!",
            position: "bottomR",
        })
        setTimeout(() => {
            isTransactionOpen(true)
        }, 5000)
        setTimeout(() => {
            window.location.href = "/"
        }, 35000)
    }

    async function handleBIDWithdrawError() {
        dispatch({
            type: "error",
            message: "Selected BID cannot be withdrawn",
            title: "BID not claimed!",
            position: "bottomR",
        })
    }

    const handleSubmit = (event) => {

        event.preventDefault()
        withdrawRejectedBids()
    }

    return (
        <div className={styles.modal}>
            <h1 className={`${styles.blockTitle} ${styles.glowTextEffect}`}>WITHDRAW BID</h1>
            {isWeb3Enabled ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className={styles.blockLabel}>
                            Would you like to withdraw your rejected bids now?
                        </label>
                        <label className={styles.blockLabel}>
                            Your current unclaimed ETH balance is:
                        </label>
                    </div>
                    <div className={styles.amountIconContainer}>
                        <div className={styles.rhombus}>
                        </div>
                        <div className={styles.rhombus2}>
                        </div>
                        <div className={styles.withdrawalAmountContainer}>
                            <span className={styles.amountText}>{bidAmount / 10 ** 18}</span>
                        </div>
                    </div>

                    {failedWithdrawal && <p className={styles.error}>Your wallet has no rejected bids to withdraw.</p>}
                    <div className={styles.buttonContainer}>
                        <button className={styles.acceptButton} type="submit" >Accept</button>
                        <button className={styles.cancelButton} type="button" onClick={() => window.location.href = "/"}>Cancel</button>
                    </div>
                </form>
            ) : (
                <p className={styles.notConnected}>Connect your wallet to withdraw BID</p>
            )}
        </div>
    )
}
