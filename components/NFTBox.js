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

export default function NFTBox({ tokenId, setTokenURI, auctionTimer, bidPlaced, isBiddingModalOpen, isClaimingModalOpen }) {

    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [status, setStatus] = useState('');
    const [isAuctionTimerZero, setIsAuctionTimerZero] = useState(Math.max(auctionTimer.blockTimestamp * 1000 + auctionTimer.time * 1000 - Date.now(), 0))

    let displayedAuctionTimer = Math.max(auctionTimer.blockTimestamp * 1000 + auctionTimer.time * 1000 - Date.now(), 0)

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


    useEffect(() => {
        if (bidPlaced) {
            if (bidPlaced.bidder !== account && isAuctionTimerZero != 0) {
                setStatus('rejected');
            } else if (bidPlaced.bidder !== account && isAuctionTimerZero == 0) {
                setStatus('noWinClosed');
            } else if (bidPlaced.bidder === account && isAuctionTimerZero == 0) {
                setStatus('winClosed');
            }
        }
    }, [bidPlaced, account, isAuctionTimerZero]);

    const handlePlaceBid = () => {
        isBiddingModalOpen(true)
    }

    const handleClaimNFT = () => {
        isClaimingModalOpen(true)
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
                        <h1 className={styles.blockTitle}>NFT DETAILS</h1>
                        <p>#{tokenId} "{tokenName}"</p>
                        <p>{tokenDescription}</p>
                    </div>
                    <div className={`${styles.description} ${styles.cardTwo}`}>
                        <h1 className={styles.blockTitle}>AUCTION DETAILS</h1>
                        {isAuctionTimerZero == 0 ? (
                            <div>
                                <p>Auction for this NFT has ended!</p>
                            </div>
                        ) : (
                            <div>
                                <p>Auction ends in {formatAge(displayedAuctionTimer)}</p>
                            </div>
                        )}
                        {bidPlaced ? (
                            <div>
                                <p>Leading Bidder: {truncateStr(bidPlaced.bidder, 15)}</p>
                                <p>Highest Bid: ETH {bidPlaced.amount / 10 ** 18}</p>
                            </div>
                        ) : (
                            isAuctionTimerZero == 0 ? (
                                <div>
                                    <p>No bid placed - auction renewal possible</p>
                                </div>
                            ) : (
                                <div>
                                    <p>No bids were placed yet</p>
                                </div>
                            )
                        )}
                        {isWeb3Enabled ? (
                            <div className={styles.cardThree}>
                                {status !== 'winClosed' && (
                                    <button className={`${styles.button} ${status === 'noWinClosed' || status === 'winClosed' || isAuctionTimerZero == 0 ? styles.disabledButton : ''} `} onClick={handlePlaceBid} disabled={status === 'noWinClosed' || status === 'winClosed' || isAuctionTimerZero == 0}>
                                        PLACE BID
                                    </button>
                                )}
                                {status === 'rejected' && (
                                    <div>
                                        <h1 className={styles.blockTitle}>STATUS UPDATE</h1>
                                        <p>You are not the leading bidder.</p>
                                        <p>Place the new highest bid or withdraw your rejected bids <a className={styles.hyperlinkWithdrawal} href="/withdraw">here</a>.</p>
                                        {/* not working */}
                                    </div>
                                )}
                                {status === 'noWinClosed' && (
                                    <div>
                                        <h1 className={styles.blockTitle}>STATUS UPDATE</h1>
                                        <p>Looks like you didn't win this auction.</p>
                                        <p>Place the new highest bid or withdraw your rejected bids <a className={styles.hyperlinkWithdrawal} href="/withdraw">here</a>.</p>
                                        <p>You can still try your luck in another auction.</p>
                                        {/* not working */}
                                    </div>
                                )}
                                {status === 'winClosed' && (
                                    <div>
                                        <button className={styles.button} onClick={handleClaimNFT} visible={status === 'winClosed'}>
                                            CLAIM NFT
                                        </button>
                                        <h1 className={styles.blockTitle}>STATUS UPDATE</h1>
                                        <p>Congratulations!</p>
                                        <p>Looks like you won this auction!</p>
                                        <p>You will be able to claim your NFT within 48h, a claim button will be enabled.</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className={styles.cardThree}>*Connect your wallet to place BID*</p>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}
