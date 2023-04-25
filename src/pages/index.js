import { useQuery } from "@apollo/client"
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import NFTBox from "../../components/NFTBox"
import BlockingLayer from "../../components/BlockingLayer"
import BlackoutLayer from "../../components/BlackoutLayer"
import GET_ACTIVE_ITEMS from "../../constants/subgraphQueries"
import BiddingModal from "../../components/BiddingModal"

export default function Home() {

  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS)
  const [isBiddingModalOpen, setIsBiddingModalOpen] = useState(false)
  const [isTransactionOpen, setIsTransactionOpen] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(() => {
    // retrieve the current index from localStorage if it exists
    if (typeof window !== 'undefined') {
      const savedIndex = localStorage.getItem('currentCardIndex')
      return savedIndex !== null ? Number(savedIndex) : 0
    } else {
      return 0
    }
  })

  useEffect(() => {
    // save the current index to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentCardIndex', currentCardIndex)
    }
  }, [currentCardIndex])

  if (loading) return (<div className={styles.loadingPage}>Loading... Please wait.</div>)
  if (error) return `Error! ${error.message}`

  const hasNFTs = data.nftMinteds.length > 0

  const handleNextCard = () => {
    setCurrentCardIndex(currentCardIndex === data.nftMinteds.length - 1 ? 0 : currentCardIndex + 1)
  }
  const handlePrevCard = () => {
    setCurrentCardIndex(currentCardIndex === 0 ? data.nftMinteds.length - 1 : currentCardIndex - 1)
  }

  const bullets = hasNFTs ? Array.from({ length: data.nftMinteds.length }).map((_, i) => (
    <div
      key={i}
      className={styles.bullet + (i === currentCardIndex ? ' ' + styles.active : '')}
      onClick={() => setCurrentCardIndex(i)}
    />
  )) : null

  const nftBidPlaceds = data.nftBidPlaceds
  const nftAuctionTimeUpdateds = data.nftAuctionTimeUpdateds

  const highestBids = {}
  const highestBlockTimestamp = {}

  nftBidPlaceds.forEach((bid) => {
    const tokenId = bid.tokenId
    const amount = Number(bid.amount)
    const bidder = bid.bidder

    if (!highestBids[tokenId] || amount > highestBids[tokenId].amount) {
      highestBids[tokenId] = { amount, bidder }
    }
  })

  nftAuctionTimeUpdateds.forEach((timer) => {
    const tokenId = timer.tokenId
    const time = timer.time
    const blockTimestamp = timer.blockTimestamp

    if (!highestBlockTimestamp[tokenId] || blockTimestamp > highestBlockTimestamp[tokenId].blockTimestamp) {
      highestBlockTimestamp[tokenId] = { blockTimestamp, time }
    }
  })

  const resultBid = Object.entries(highestBids)
    .sort((a, b) => a[0] - b[0])
    .map((entry) => ({ tokenId: entry[0], amount: entry[1].amount, bidder: entry[1].bidder }))

  const resultTime = Object.entries(highestBlockTimestamp)
    .sort((a, b) => a[0] - b[0])
    .map((entry) => ({ tokenId: entry[0], blockTimestamp: entry[1].blockTimestamp, time: entry[1].time }))

  console.log(highestBids)

  return (
    <div className={styles.container}>
      {hasNFTs ? (
        <div className={styles.cardContainer}>
          <NFTBox
            key={data.nftMinteds[currentCardIndex].tokenId}
            mintedItem={data.nftMinteds[currentCardIndex]}
            tokenId={data.nftMinteds[currentCardIndex].tokenId}
            setTokenURI={data.nftSetTokenURIs[currentCardIndex]}
            bidPlaced={highestBids[currentCardIndex]}
            auctionTimer={highestBlockTimestamp[currentCardIndex]}
            isBiddingModalOpen={setIsBiddingModalOpen}
          />
          {isTransactionOpen && (<BlackoutLayer />)}
          {isBiddingModalOpen && (
            <>
              <BlockingLayer />
              <BiddingModal
                key={data.nftMinteds[currentCardIndex].tokenId}
                tokenId={data.nftMinteds[currentCardIndex].tokenId}
                isBiddingModalOpen={setIsBiddingModalOpen}
                isTransactionOpen={setIsTransactionOpen}
              />
            </>
          )}
        </div>
      ) : (<div className={styles.loadingPage}>No NFT has been minted yet!</div>)}

      <div className={styles.arrow + ' ' + styles.left} onClick={handlePrevCard}>{'<'}</div>
      <div className={styles.arrow + ' ' + styles.right} onClick={handleNextCard}>{'>'}</div>
      {hasNFTs ? (
        <div className={styles.bulletsContainer}>{bullets}</div>
      ) : (<div className={styles.loadingPage}>No NFT has been minted yet!</div>)}
    </div>
  )
}