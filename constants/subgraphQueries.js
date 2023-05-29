import { gql } from "@apollo/client"

const GET_ACTIVE_ITEMS = gql`
{
  nftMinteds(orderBy: tokenId) {
    tokenId
    id
    minter
    blockTimestamp
  }
  nftSetTokenURIs(orderBy: tokenId) {
    uri
  }
  nftAuctionTimeUpdateds(orderBy: tokenId) {
    tokenId
    time
    blockTimestamp
  }
  nftBidPlaceds(orderBy: tokenId) {
    bidder
    amount
    tokenId
  }
  transfers(
    orderBy: tokenId
    where: {from_not_contains: "0x0000000000000000000000000000000000000000"}
  ) {
    tokenId
  }
  nftWithdrawCompleteds(orderBy: tokenId) {
    tokenId
  }
  nftAddedPendingBidsForWithdrawals(orderBy: blockTimestamp) {
    bid
    bidder
    blockTimestamp
  }
  nftPendingBidsWithdrawals(orderBy: blockTimestamp) {
    bid
    bidder
    blockTimestamp
  }
}
`

export default GET_ACTIVE_ITEMS

// {
//   nftMinteds {
//     blockNumber
//     blockTimestamp
//     id
//     minter
//     tokenId
//     transactionHash
//   }
// }

