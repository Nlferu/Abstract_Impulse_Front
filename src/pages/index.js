import { useQuery } from "@apollo/client"
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import GET_ACTIVE_ITEMS from "../../constants/subgraphQueries"
import NFTBox from "../../components/NFTBox"
import BlockingLayer from "../../components/BlockingLayer"
import BlackoutLayer from "../../components/BlackoutLayer"
import BiddingModal from "../../components/BiddingModal"
import ClaimingNFT from "../../components/ClaimingNFT"

export default function Home() {

  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS)
  const [isBiddingModalOpen, setIsBiddingModalOpen] = useState(false)
  const [isClaimingModalOpen, setIsClaimingModalOpen] = useState(false)
  const [isTransactionOpen, setIsTransactionOpen] = useState(false)
  const [isDesktopView, setIsDesktopView] = useState(false)
  const [disabledCardsIndexes, setDisabledCardsIndexes] = useState([])

  const getFirstValidIndex = () => {
    let index = 0;
    while (disabledCardsIndexes.includes(index)) {
      index++;
    }
    return index;
  }

  const [currentCardIndex, setCurrentCardIndex] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedIndex = localStorage.getItem('currentCardIndex');
      if (savedIndex !== null && !disabledCardsIndexes.includes(Number(savedIndex))) {
        return Number(savedIndex);
      } else {
        return getFirstValidIndex();
      }
    } else {
      return getFirstValidIndex();
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentCardIndex', currentCardIndex)
    }
  }, [currentCardIndex])

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopView(window.innerWidth > 900)
    }

    // Detect if window is not undefined (browser environment)
    if (typeof window !== 'undefined') {
      handleResize()
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  if (loading) return (<div className={styles.loadingPage}>Loading... Please wait.</div>)
  if (isDesktopView === null) return null
  if (!isDesktopView) {
    return (
      <div className={styles.smartphoneVersion}>
        <p className={styles.msgTxtTitle}>Desktop version only, due to web3 dependencies.</p>
        <p className={styles.msgTxt}>Please use a wider desktop or a laptop view.</p>
      </div>
    )
  }
  if (error) return `Error! ${error.message}`

  const hasNFTs = data.nftMinteds.length > 0

  const handleNextCard = () => {
    let newIndex = currentCardIndex
    do {
      newIndex = (newIndex + 1) % data.nftMinteds.length
    } while (disabledCardsIndexes.includes(newIndex))
    setCurrentCardIndex(newIndex)
  }
  const handlePrevCard = () => {
    let newIndex = currentCardIndex
    do {
      newIndex = (newIndex - 1 + data.nftMinteds.length) % data.nftMinteds.length
    } while (disabledCardsIndexes.includes(newIndex))
    setCurrentCardIndex(newIndex)
  }

  const bullets = hasNFTs ? data.nftMinteds.map((_, i) => (
    <div
      key={i}
      className={styles.bullet + (i === currentCardIndex ? ' ' + styles.active : '')}
      style={disabledCardsIndexes.includes(i) ? { display: 'none' } : {}}
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

  const approvedNfts = data.nftWithdrawCompleteds.reduce((acc, nft) => {
    acc[nft.tokenId] = true
    return acc
  }, [])
  if (approvedNfts[currentCardIndex]) { } else { approvedNfts[currentCardIndex] = false }

  const claimedNfts = data.transfers.reduce((acc, nft) => {
    acc[nft.tokenId] = true
    return acc
  }, [])
  if (claimedNfts[currentCardIndex]) { } else { claimedNfts[currentCardIndex] = false }

  if (disabledCardsIndexes.includes(currentCardIndex)) return null

  return (
    <div className={styles.container}>
      {hasNFTs ? (
        <div className={styles.cardContainer}>
          <NFTBox
            key={data.nftMinteds[currentCardIndex].tokenId}
            mintedItem={data.nftMinteds[currentCardIndex]} //to remove - just to check
            tokenId={data.nftMinteds[currentCardIndex].tokenId}
            setTokenURI={data.nftSetTokenURIs[currentCardIndex]}
            bidPlaced={highestBids[currentCardIndex]}
            claimedNfts={claimedNfts[currentCardIndex]}
            approvedNfts={approvedNfts[currentCardIndex]}
            auctionTimer={highestBlockTimestamp[currentCardIndex]}
            isBiddingModalOpen={setIsBiddingModalOpen}
            isClaimingModalOpen={setIsClaimingModalOpen}
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
          {isClaimingModalOpen && (
            <>
              <BlockingLayer />
              <ClaimingNFT
                key={data.nftMinteds[currentCardIndex].tokenId}
                mintedItem={data.nftMinteds[currentCardIndex]}
                bidPlaced={highestBids[currentCardIndex]}
                isClaimingModalOpen={setIsClaimingModalOpen}
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