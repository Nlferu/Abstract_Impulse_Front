import styles from '@/styles/Home.module.css'
import { useMoralis } from "react-moralis"
import { useState, useEffect } from 'react'
import Image from "next/image"
import { formatAge } from './AuctionTimer'

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

export default function NFTBox({ mintedItem, setTokenURI, bidPlaced, isBiddingModalOpen, tokenId }) {

    const { isWeb3Enabled } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")

    const handlePlaceBid = () => {
        isBiddingModalOpen(true); // call the isBiddingModalOpen function to update the state
    };

    async function updateUI() {
        const tokenURI = setTokenURI.uri

        if (tokenURI) {
            const requestURL = setTokenURI.uri
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    useEffect(() => {
        if (setTokenURI.uri !== "") {
            updateUI()
        }
    }, [setTokenURI])

    return (
        <div className={`${styles.container} ${styles.card}`}>

            <div className={styles.content}>
                <div className={styles.imageContainer}>
                    <Image
                        loader={() => imageURI}
                        src={imageURI}
                        width={1200}
                        height={1200}
                        objectFit="contain"
                        alt="minted NFT"
                    />
                </div>
                <div>
                    <div className={`${styles.description} ${styles.card}`}>
                        <h1>NFT DETAILS</h1>
                        <p>#{tokenId} "{tokenName}"</p>
                        <p>{tokenDescription}</p>
                    </div>
                    <div className={`${styles.description} ${styles.cardTwo}`}>
                        <h1>AUCTION DETAILS</h1>
                        <p>Auction ends in {formatAge(mintedItem.blockTimestamp * 1000 + 604800000 - Date.now())}</p>
                        {bidPlaced ? (
                            <div>
                                <p>Leading Bidder: {truncateStr(bidPlaced.bidder, 15)}</p>
                                <p>Highest Bid: {bidPlaced.amount / 10 ** 18}</p>
                            </div>
                        ) : (
                            <div>
                                <p>No bids placed yet!</p>
                            </div>
                        )}
                        {isWeb3Enabled ? (
                            <button className={styles.button} onClick={handlePlaceBid}>PLACE BID</button>
                        ) : (
                            <p className={styles.cardThree}>*** Connect your wallet to place bid ***</p>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}
