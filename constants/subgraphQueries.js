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

