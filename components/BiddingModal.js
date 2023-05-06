import styles from '@/styles/BiddingModal.module.css'
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useState } from 'react'
import networkMapping from "../constants/networkMapping.json"
import absImpAbi from "../constants/AbstractImpulseNFT.json"
import { useNotification } from "web3uikit"

export default function BiddingModal({ tokenId, isBiddingModalOpen, isTransactionOpen }) {

    const { chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : ''
    const absImpAddress = chainString ? networkMapping[chainString].AbstractImpulseNFT[0] : ''
    const currTokenId = tokenId
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()
    const [bidAmount, setBidAmount] = useState('')
    const [invalidBidAmount, setInvalidBidAmount] = useState(false)

    const handleCancel = () => {
        isBiddingModalOpen(false)

    }

    const handleBidAmountChange = (event) => {
        const { value } = event.target
        setBidAmount(value)

        if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            setInvalidBidAmount(true)
        } else {
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
            onError: (error) => console.log(error),
        })

    }

    const handleSubmit = (event) => {
        event.preventDefault()
        placeNFTBid()
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

    return (
        <div className={styles.modal}>
            <h1 className={styles.blockTitle}>AUCTION BIDDING</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Bid Amount (ETH):
                    <input className={styles.inputBidding} type="number" step="0.01" min="0.1" placeholder=" min. 0.1 " value={bidAmount} onChange={handleBidAmountChange} />
                </label>
                {invalidBidAmount && <p className={styles.error}>Please enter a valid bid amount.</p>}
                <div className={styles.buttonContainer}>
                    <button className={styles.acceptButton} type="submit" >Accept</button>
                    <button className={styles.cancelButton} type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}
