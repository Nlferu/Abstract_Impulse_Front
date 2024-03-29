import styles from "@/styles/Home.module.css";
import { useMoralis } from "react-moralis";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { formatAge } from "./AuctionTimer";
import brush from "../public/BRUSH3.png";
import l1 from "../public/1.png";
import l2 from "../public/2.png";
import l3 from "../public/3.png";
import l4 from "../public/4.png";

const truncateStr = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr;

  const separator = "...";
  const separatorLength = separator.length;
  const charsToShow = strLen - separatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  );
};

export default function NFTBox({
  tokenId,
  claimedNfts,
  approvedNfts,
  setTokenURI,
  auctionTimer,
  bidPlaced,
  isBiddingModalOpen,
  swipedUp,
  isDesktopView,
}) {
  const { isWeb3Enabled, account } = useMoralis();
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [status, setStatus] = useState("");
  const [isAuctionTimerZero, setIsAuctionTimerZero] = useState(
    Math.max(
      auctionTimer.blockTimestamp * 1000 +
        auctionTimer.time * 1000 -
        Date.now(),
      0
    )
  );
  const [imageLoading, setImageLoading] = useState(true);
  const loadingImages = [l1, l2, l3, l4];
  const [currentImages, setCurrentImages] = useState([]);
  const intervalRef = useRef(null);

  const [isImageLoadDelayed, setIsImageLoadDelayed] = useState(true);

  useEffect(() => {
    if (imageLoading) {
      intervalRef.current = setInterval(() => {
        setCurrentImages((prevImages) => {
          if (prevImages.length === loadingImages.length) {
            return [loadingImages[0]];
          } else {
            return [
              ...prevImages,
              loadingImages[prevImages.length % loadingImages.length],
            ];
          }
        });
      }, 250);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [imageLoading]);

  let displayedAuctionTimer = Math.max(
    auctionTimer.blockTimestamp * 1000 + auctionTimer.time * 1000 - Date.now(),
    0
  );
  let auctionTime = formatAge(displayedAuctionTimer);

  async function updateUI() {
    const tokenURI = setTokenURI.uri;

    if (tokenURI) {
      const requestURL = setTokenURI.uri;
      const tokenURIResponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageURIURL = imageURI;
      setImageURI(imageURIURL);
      setTokenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
    }
  }

  useEffect(() => {
    if (setTokenURI.uri !== "") {
      updateUI();
    }
  }, [setTokenURI]);

  useEffect(() => {
    if (bidPlaced) {
      if (bidPlaced.bidder !== account && isAuctionTimerZero !== 0) {
        setStatus("rejected");
      } else if (bidPlaced.bidder !== account && isAuctionTimerZero === 0) {
        setStatus("noWinClosed");
      } else if (bidPlaced.bidder === account && isAuctionTimerZero === 0) {
        setStatus("winClosed");
      }
    }
  }, [bidPlaced, account, isAuctionTimerZero]);

  const handlePlaceBid = () => {
    isBiddingModalOpen(true);
  };

  const handleClaimNFT = () => {
    isClaimingModalOpen(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsImageLoadDelayed(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.container} ${styles.card}`}>
      <div
        className={`${styles.content} ${
          swipedUp && !isDesktopView ? styles.resizedContent : ""
        }`}
      >
        <div className={`${styles.imageContainer}`}>
          <div className={styles.NFTContainer}>
            {!isImageLoadDelayed && (
              <Image
                className={`${
                  imageLoading ? styles.imageLoading : styles.firstImage
                } ${swipedUp && !isDesktopView ? styles.firstResize : ""}`}
                loader={() => imageURI}
                src={imageURI}
                width={4000}
                height={4000}
                alt="minted NFT"
                onLoad={() => setImageLoading(false)}
              />
            )}
          </div>
          <div>
            {(status === "winClosed" || status === "noWinClosed") &&
              !imageLoading && (
                <Image
                  className={`${
                    imageLoading ? styles.imageLoading : styles.soldOutContainer
                  } ${swipedUp && !isDesktopView ? styles.secondResize : ""}`}
                  src={brush}
                  width={4000}
                  height={4000}
                  alt="sold out NFT"
                />
              )}
          </div>
          <div
            className={`${styles.loadingBrushesContainer} ${
              swipedUp && !isDesktopView ? styles.thirdResize : ""
            }`}
          >
            {imageLoading &&
              currentImages.map((imgSrc, index) => (
                <Image
                  key={index}
                  src={imgSrc}
                  width={4000}
                  height={4000}
                  alt="loading image"
                />
              ))}
          </div>
        </div>
        {swipedUp ? (
          <div className="">
            <div className={`${styles.nftDetails} mt-[5rem]`}>
              <div className={`${styles.description} ${styles.card}`}>
                <h1 className={`${styles.blockTitle} ${styles.glowTextEffect}`}>
                  NFT DETAILS
                </h1>
                <p>
                  #{tokenId} "{tokenName}"
                </p>
                <p>{tokenDescription}</p>
              </div>
            </div>
            <div className={`${styles.auctionDetails} mt-[5rem]`}>
              <div className={`${styles.description} ${styles.cardTwo}`}>
                <h1 className={`${styles.blockTitle} ${styles.glowTextEffect}`}>
                  AUCTION DETAILS
                </h1>
                {isAuctionTimerZero == 0 ? (
                  <div>
                    <p>Auction for this NFT has ended!</p>
                  </div>
                ) : (
                  <div>
                    <p>Auction ends in {auctionTime}</p>
                  </div>
                )}
                {bidPlaced ? (
                  <div>
                    <p>Leading Bidder: {truncateStr(bidPlaced.bidder, 15)}</p>
                    <p>Highest Bid: ETH {bidPlaced.amount / 10 ** 18}</p>
                  </div>
                ) : isAuctionTimerZero == 0 ? (
                  <div>
                    <p>No bid placed - auction renewal possible</p>
                  </div>
                ) : (
                  <div>
                    <p>No bids were placed yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className={`${styles.statusUpdate} mt-[5rem]`}>
              <div className={`${styles.description} ${styles.cardThree}`}>
                {isWeb3Enabled ? (
                  <div>
                    <div>
                      {status !== "winClosed" && (
                        <button
                          className={
                            status === "noWinClosed" ||
                            status === "winClosed" ||
                            isAuctionTimerZero === 0
                              ? styles.disabledButton
                              : styles.button
                          }
                          onClick={handlePlaceBid}
                          disabled={
                            status === "noWinClosed" ||
                            status === "winClosed" ||
                            isAuctionTimerZero === 0
                          }
                        >
                          PLACE BID
                        </button>
                      )}
                    </div>
                    {status === "rejected" && (
                      <div>
                        <h1
                          className={`${styles.blockTitle} ${styles.glowTextEffect}`}
                        >
                          STATUS UPDATE
                        </h1>
                        <p>You are not the leading bidder.</p>
                        <p>
                          Place the new highest bid or withdraw your rejected
                          bids{" "}
                          <a
                            className={styles.hyperlinkWithdrawal}
                            href="/withdraw"
                          >
                            here
                          </a>
                          .
                        </p>
                      </div>
                    )}
                    {status === "noWinClosed" && (
                      <div>
                        <h1
                          className={`${styles.blockTitle} ${styles.glowTextEffect}`}
                        >
                          STATUS UPDATE
                        </h1>
                        <p>Looks like you didn't win this auction.</p>
                        <p>
                          Place the new highest bid or withdraw your rejected
                          bids{" "}
                          <a
                            className={styles.hyperlinkWithdrawal}
                            href="/withdraw"
                          >
                            here
                          </a>
                          .
                        </p>
                        <p>You can still try your luck in another auction.</p>
                      </div>
                    )}
                    {status === "winClosed" && (
                      <div>
                        <div>
                          <button
                            className={
                              approvedNfts && !claimedNfts
                                ? styles.button
                                : styles.disabledButton
                            }
                            onClick={handleClaimNFT}
                            disabled={!approvedNfts || claimedNfts}
                          >
                            CLAIM NFT
                          </button>
                        </div>
                        <h1
                          className={`${styles.blockTitle} ${styles.glowTextEffect}`}
                        >
                          STATUS UPDATE
                        </h1>
                        <p>Congratulations!</p>
                        <p>Looks like you won this auction!</p>
                        {approvedNfts && !claimedNfts && (
                          <p>Now you are able to claim your NFT.</p>
                        )}
                        {!approvedNfts && !claimedNfts && (
                          <p>You will be able to claim your NFT within 48h.</p>
                        )}
                        {approvedNfts && claimedNfts && (
                          <p>You have already claimed your NFT.</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={` ${styles.glowTextEffect} ${styles.cardThree} ${styles.pulsatingText}`}
                  >
                    <p>CONNECT WALLET TO PLACE BID</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className={`${styles.description} ${styles.card}`}>
              <p
                className={`${styles.blockTitle} ${styles.glowTextEffect} ${styles.pulsatingText} ${styles.swipeUp}`}
              >
                SWIPE UP FOR NFT AUCTION DETAILS
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
