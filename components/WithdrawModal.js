
import styles from '@/styles/Withdraw.module.css'
import { useWeb3Contract, useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import absImpAbi from "../constants/AbstractImpulseNFT.json"
import React, { useState, useRef } from 'react'
import { useNotification } from "web3uikit"
import ReCAPTCHA from "react-google-recaptcha"


export default function WithdrawModal({ isTransactionOpen, bidToWithdraw }) {

    const RECAPTCHA_KEY = process.env.RECAPTCHA_KEY
    const { chainId, isWeb3Enabled, account } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : ''
    const absImpAddress = chainString ? networkMapping[chainString].AbstractImpulseNFT[0] : ''
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()
    const [failedWithdrawal, setFailedWithdrawal] = useState(false)
    const [noBalanceToWithdraw, setNoBalanceToWithdraw] = useState(false)
    const bidAmount = bidToWithdraw && bidToWithdraw[account] && bidToWithdraw[account].bidAmount ? bidToWithdraw[account].bidAmount : 0
    const [captchaError, setCaptchaError] = useState(false);
    const [isVerified, setIsVerified] = useState(false)
    const recaptchaRef = useRef();

    noBalanceToWithdraw

    const handleCancel = () => {
        window.location.href = "/"
        setIsVerified(false)
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
    }

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
            onError: (error) => {
                if (bidAmount === 0) {
                    setNoBalanceToWithdraw(true)
                    setIsVerified(false)
                    recaptchaRef.current.reset()
                } else {
                    setFailedWithdrawal(true)
                    setIsVerified(false)
                    recaptchaRef.current.reset()
                }
            },
        })

    }

    async function handleBIDWithdrawSuccess() {
        dispatch({
            type: "success",
            message: "BID will be shortly withdrawn to your account",
            title: "BID has been claimed!",
            position: "bottomR",
        })
        setTimeout(() => {
            isTransactionOpen(true)
        }, 5000)
        setTimeout(() => {
            window.location.href = "/withdraw"
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

        if (isVerified) {
            withdrawRejectedBids()
            setCaptchaError(false)
        } else {
            setCaptchaError(true)
        }
    }

    const handleRecaptcha = (value) => {
        setIsVerified(value ? true : false)
        setCaptchaError(value ? false : true)
        setFailedWithdrawal(value ? false : true)
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
                    {failedWithdrawal && <p className={styles.error}>Transaction failed, please try again.</p>}
                    {noBalanceToWithdraw && <p className={styles.error}>Your wallet has no rejected bids to withdraw.</p>}
                    {captchaError && <p className={styles.error}>Please complete the captcha before submitting.</p>}
                    <div className={styles.captchaBox}>
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={RECAPTCHA_KEY}
                            onChange={handleRecaptcha}
                            theme='dark'
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.acceptButton} type="submit" >Accept</button>
                        <button className={styles.cancelButton} type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            ) : (
                <p className={styles.notConnected}>CONNECT WALLET TO WITHDRAW BID</p>
            )}
        </div>
    )
}
