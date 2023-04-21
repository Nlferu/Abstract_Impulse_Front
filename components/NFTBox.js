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

export default function NFTBox({ mintedItem, setTokenURI, bidPlaced, isBiddingModalOpen, tokenId, auctionTimer }) {

    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [isBidRejected, setIsBidRejected] = useState(false)
    const [isNoWinClosed, setIsNoWinClosed] = useState(false)
    const [isWinClosed, setIsWinClosed] = useState(false)

    let auctionTimerValue = auctionTimer.blockTimestamp * 1000 + auctionTimer.time * 1000 - Date.now()

    if (auctionTimerValue <= 0) {
        auctionTimerValue = 0
    }

    if (bidPlaced && bidPlaced.bidder !== account && auctionTimerValue != 0) {
        // if ()
        setIsBidRejected(true)
    }

    if (bidPlaced && bidPlaced.bidder !== account && auctionTimerValue == 0) {
        // if ()
        setIsNoWinClosed(true)
    }

    if (bidPlaced && bidPlaced.bidder === account && auctionTimerValue == 0) {
        // if ()
        setIsWinClosed(true)
    }

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

    const handlePlaceBid = () => {
        isBiddingModalOpen(true) // call the isBiddingModalOpen function to update the state
    }

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
                        <p>Auction ends in {formatAge(auctionTimerValue)}</p>
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
                        {isBidRejected ? (<p>You are no longer the leading bidder. Withdraw your rejected bid in the withdrawal section and place the new highest bid.</p>) : ("")}
                        {isNoWinClosed ? (<p>Looks like you didn't win this auction. Withdraw your rejected bid in the withdrawal section and participate in another one! </p>) : ("")}
                        {/* {isNoWinBidClosed ? (<p>Auction for this NFT has ended. You can participate in another one! </p>) : ("")} */}
                        {isWinClosed ? (<p>Congratulations! Looks like you won the auction! You will be able to withdraw your NFT in the withdrawal section within 48h max.</p>) : ("")}
                    </div>
                </div>
            </div>
        </div >
    )
}
