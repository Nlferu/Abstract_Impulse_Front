import styles from '@/styles/ClaimingNFT.module.css'
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useState } from 'react'
import networkMapping from "../constants/networkMapping.json"
import absImpAbi from "../constants/AbstractImpulseNFT.json"
import React from 'react'
import { useNotification } from "web3uikit"


export default function ClaimingModal({ mintedItem, bidPlaced, isClaimingModalOpen, isTransactionOpen }) {

    const { chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : ''
    const absImpAddress = networkMapping[chainString].AbstractImpulseNFT[0]
    const currTokenId = mintedItem.tokenId
    const [newOwnerAddress, setNewOwnerAddress] = useState('')
    const [invalidAddress, setInvalidAddress] = useState(false)
    const dispatch = useNotification()
    const { runContractFunction } = useWeb3Contract()


    const handleCancel = () => {
        isClaimingModalOpen(false)
    }

    const handleAddressChange = (event) => {
        const { value } = event.target
        setNewOwnerAddress(value)

        if (!/^(0x)?[0-9a-f]{40}$/i.test(value)) {
            setInvalidAddress(true)
        } else {
            setInvalidAddress(false)
        }
    }

    const winningBidder = newOwnerAddress ? '' : (bidPlaced ? bidPlaced.bidder : '');

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
            onError: (error) => console.log(error),
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
        claimApprovedNFT()
    }


    return (
        <div className={styles.modal}>
            <h1 className={styles.blockTitle}>CLAIMING NFT</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    New owner's address*:
                    <input
                        className={styles.inputClaiming}
                        placeholder=" (optional) "
                        value={newOwnerAddress}
                        onChange={handleAddressChange}
                    />
                </label>
                {invalidAddress && <p className={styles.error}>Please enter a valid ETH network address.</p>}
                <p> *Enter only if different from your wallet</p>
                <div className={styles.buttonContainer}>
                    <button className={styles.acceptButton} type="submit" >Accept</button>
                    <button className={styles.cancelButton} type="button" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    )
}
