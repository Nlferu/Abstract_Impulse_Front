import styles from '@/styles/Withdraw.module.css'
import { useQuery } from "@apollo/client"
import { useState, useEffect } from 'react'
import WithdrawModal from "../../components/WithdrawModal"
import BlackoutLayer from "../../components/BlackoutLayer"
import GET_ACTIVE_ITEMS from "../../constants/subgraphQueries"


export default function Withdraw() {
    const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS)
    const [isTransactionOpen, setIsTransactionOpen] = useState(false)
    const [isDesktopView, setIsDesktopView] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsDesktopView(window.innerWidth > 900)
        }

        if (typeof window !== 'undefined') {
            setIsDesktopView(window.innerWidth > 900)
            window.addEventListener('resize', handleResize)

            return () => {
                window.removeEventListener('resize', handleResize)
            }
        }
    }, [])

    if (loading) return (<div className={styles.loadingPage}>Loading... Please wait.</div>)
    if (!isDesktopView) {
        return (
            <div className={styles.smartphoneVersion}>
                <p className={styles.msgTxtTitle}>Desktop version only, due to web3 dependencies.</p>
                <p className={styles.msgTxt}>Please use a wider desktop or a laptop view.</p>
            </div>
        )
    }
    if (error) return `Error! ${error.message}`

    const nftUnclaimedBids = data.nftAddedPendingBidsForWithdrawals
    const nftClaimedBids = data.nftPendingBidsWithdrawals

    const recentUnclaimedBids = {}
    const recentClaimedBids = {}

    nftUnclaimedBids.forEach((amountToWithdraw) => {
        const bidAmount = amountToWithdraw.bid
        const bidder = amountToWithdraw.bidder
        const blockTimestamp = amountToWithdraw.blockTimestamp

        if (!recentUnclaimedBids[bidder] || blockTimestamp > recentUnclaimedBids[bidder].blockTimestamp) {
            recentUnclaimedBids[bidder] = { bidAmount, blockTimestamp }
        }
    })

    nftClaimedBids.forEach((withdrawnAmount) => {
        const bidAmount = withdrawnAmount.bid
        const bidder = withdrawnAmount.bidder
        const blockTimestamp = withdrawnAmount.blockTimestamp

        if (!recentClaimedBids[bidder] || blockTimestamp > recentClaimedBids[bidder].blockTimestamp) {
            recentClaimedBids[bidder] = { bidAmount, blockTimestamp }
        }
    })

    for (let bidder in recentUnclaimedBids) {
        if (recentClaimedBids[bidder] && recentClaimedBids[bidder].blockTimestamp > recentUnclaimedBids[bidder].blockTimestamp) {
            recentUnclaimedBids[bidder].bidAmount = 0
        }
    }



    return (
        <div className={styles.container}>
            {isTransactionOpen && (<BlackoutLayer />)}
            <WithdrawModal
                key={setIsTransactionOpen}
                isTransactionOpen={setIsTransactionOpen}
                bidToWithdraw={recentUnclaimedBids}
            />
        </div>
    )
}