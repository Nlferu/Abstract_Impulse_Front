import styles from '@/styles/BiddingModal.module.css'
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useState, useRef } from 'react'
import networkMapping from "../constants/networkMapping.json"
import absImpAbi from "../constants/AbstractImpulseNFT.json"
import { useNotification } from "web3uikit"
import ReCAPTCHA from "react-google-recaptcha"

export default function BiddingModal({ tokenId, isBiddingModalOpen, isTransactionOpen }) {

    const RECAPTCHA_KEY = process.env.RECAPTCHA_KEY
    const { chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : ''
    const absImpAddress = chainString ? networkMapping[chainString].AbstractImpulseNFT[0] : ''
    const currTokenId = tokenId
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()
    const [bidAmount, setBidAmount] = useState('')
    const [invalidBidAmount, setInvalidBidAmount] = useState(false)
    const [bidTooSmall, setBidTooSmall] = useState(false)
    const [captchaError, setCaptchaError] = useState(false);
    const [isVerified, setIsVerified] = useState(false)
    const recaptchaRef = useRef();

    const handleCancel = () => {
        isBiddingModalOpen(false)
        setIsVerified(false)
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
    }

    const handleBidAmountChange = (event) => {
        const { value } = event.target
        setBidAmount(value)


        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            setInvalidBidAmount(true)
        } else {
            setBidTooSmall(false)
            setInvalidBidAmount(false)
        }
    }

    async function placeNFTBid() {

        const placeBid = {
            abi: absImpAbi,
            contractAddress: absImpAddress,
            functionName: "placeBid",
            msgValue: bidAmount * 10 ** 18,
            params: {
                tokenId: currTokenId,
            },
        }

        await runContractFunction({
            params: placeBid,
            onError: () => handleBidError(),
            onSuccess: () => handleBidSuccess(),
            onError: (error) => {
                setBidTooSmall(true)
                setIsVerified(false)
                recaptchaRef.current.reset()
            }
        })

    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (isVerified) {
            placeNFTBid()
            setCaptchaError(false)
        } else {
            setCaptchaError(true)
        }
    }

    async function handleBidSuccess() {
        dispatch({
            type: "success",
            message: "Bid will be shortly placed for the chosen NFT",
            title: "BID accepted!",
            position: "bottomR",
        })
        setTimeout(() => {
            isTransactionOpen(true)
        }, 5000)
        setTimeout(() => {
            location.reload()
        }, 35000)
    }


    async function handleBidError() {
        dispatch({
            type: "error",
            message: "Bid has not been placed for chosen NFT",
            title: "BID not accepted!",
            position: "bottomR",
        })
    }

    const handleRecaptcha = (value) => {
        setIsVerified(value ? true : false)
        setCaptchaError(value ? false : true)
        setBidTooSmall(value ? false : true)
    }

    return (
        <div className={styles.modal}>
            <h1 className={`${styles.blockTitle} ${styles.glowTextEffect}`}>AUCTION BIDDING</h1>
            <form onSubmit={handleSubmit}>
                <label className={styles.bidAmount}>
                    Bid Amount (ETH):
                    <input className={styles.inputBidding} type="number" step="0.01" min="0.1" placeholder=" min. 0.1 " value={bidAmount} onChange={handleBidAmountChange} />
                </label>
                {invalidBidAmount && <p className={styles.errorTop}>Error: Invalid bid entered.</p>}
                {bidTooSmall && (
                    < div >
                        <p className={styles.errorTop}>Transaction failed.</p>
                        <p className={styles.error}>Your bid amount may be insufficient.</p>
                        <p className={styles.error}>Please check the highest bid and try again.</p>
                    </div>
                )}
                {captchaError && <p className={styles.errorTop}>Please complete the captcha before submitting.</p>}
                <div className={styles.captchaBox}>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey='6LdtCV0mAAAAAI4W4P-5PLUJrmeXw8mEwwxQV9en'
                        onChange={handleRecaptcha}
                        theme='dark'
                    />
                </div>

                <div className={styles.buttonContainer}>
                    <button className={styles.acceptButton} type="submit" >Accept</button>
                    <button className={styles.cancelButton} type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form >
        </div >
    )
}
