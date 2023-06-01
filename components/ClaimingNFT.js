import styles from '@/styles/ClaimingNFT.module.css'
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useState, useRef } from 'react'
import networkMapping from "../constants/networkMapping.json"
import absImpAbi from "../constants/AbstractImpulseNFT.json"
import React from 'react'
import { useNotification } from "web3uikit"
import ReCAPTCHA from "react-google-recaptcha"


export default function ClaimingModal({ mintedItem, bidPlaced, isClaimingModalOpen, isTransactionOpen }) {

    const RECAPTCHA_KEY = process.env.RECAPTCHA_KEY
    const { chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : ''
    const absImpAddress = networkMapping[chainString].AbstractImpulseNFT[0]
    const currTokenId = mintedItem.tokenId
    const [newOwnerAddress, setNewOwnerAddress] = useState('')
    const [invalidAddress, setInvalidAddress] = useState(false)
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()
    const [wrongAddress, setWrongAddress] = useState(false)
    const [captchaError, setCaptchaError] = useState(false);
    const [isVerified, setIsVerified] = useState(false)
    const recaptchaRef = useRef();


    const handleCancel = () => {
        isClaimingModalOpen(false)
        setIsVerified(false)
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
    }

    const handleAddressChange = (event) => {
        const { value } = event.target
        setNewOwnerAddress(value)

        if (value === "") {
            setInvalidAddress(false)
        } else if (!/^(0x)?[0-9a-f]{40}$/i.test(value)) {
            setInvalidAddress(true)
        } else {
            setInvalidAddress(false)
        }
    }

    const winningBidder = newOwnerAddress ? '' : (bidPlaced ? bidPlaced.bidder : '')

    async function claimApprovedNFT() {

        const safeTransferFrom = {
            abi: absImpAbi,
            contractAddress: absImpAddress,
            functionName: "safeTransferFrom(address,address,uint256)",
            params: {
                from: mintedItem.minter,
                to: newOwnerAddress || winningBidder,
                tokenId: currTokenId,
            },
        }

        await runContractFunction({
            params: safeTransferFrom,
            onError: () => handleNFTWithdrawalError(),
            onSuccess: () => handleNFTWithdrawalSuccess(),
            onError: (error) => {
                setWrongAddress(true)
                setIsVerified(false)
                recaptchaRef.current.reset()
            },
        })

    }

    async function handleNFTWithdrawalSuccess() {
        dispatch({
            type: "success",
            message: "NFT will be shortly withdrawn to your account",
            title: "NFT claimed!",
            position: "bottomR",
        })
        setTimeout(() => {
            isTransactionOpen(true)
        }, 5000)
        setTimeout(() => {
            location.reload()
        }, 35000)
    }

    async function handleNFTWithdrawalError() {
        dispatch({
            type: "error",
            message: "Selected NFT cannot be withdrawn",
            title: "NFT not claimed!",
            position: "bottomR",
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (isVerified) {
            claimApprovedNFT()
            setCaptchaError(false)
        } else {
            setCaptchaError(true)
        }
    }

    const handleRecaptcha = (value) => {
        setIsVerified(value ? true : false)
        setCaptchaError(value ? false : true)
        setWrongAddress(value ? false : true)
    }

    return (
        <div className={styles.modal}>
            <h1 className={`${styles.blockTitle} ${styles.glowTextEffect}`}>CLAIMING NFT</h1>
            <form onSubmit={handleSubmit}>
                <label className={styles.newOwnersAddress}>
                    New owner's address*:
                    <input
                        className={styles.inputClaiming}
                        placeholder=" (optional) "
                        value={newOwnerAddress}
                        onChange={handleAddressChange}
                    />
                </label>
                <p className={styles.newOwnersAddressNote}> *Enter only if different from your bidding wallet address</p>
                {invalidAddress && <p className={styles.error}>Please enter a valid ETH network address.</p>}
                {wrongAddress && <p className={styles.error}>Transaction failed - verify winning address and try again.</p>}
                {captchaError && <p className={styles.error}>Please complete the captcha before submitting.</p>}
                <div className={styles.captchaBox}>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey='6LeG3lwmAAAAAEhJz_uT_sHpCy1TGsE0wspLoUYS'
                        onChange={handleRecaptcha}
                        theme='dark'
                    />
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.acceptButton} type="submit" >Accept</button>
                    <button className={styles.cancelButton} type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}
