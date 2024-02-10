import Image from "next/image";
import styles from "@/styles/About.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <div className={styles.blockContainer}>
        <h1 className={`${styles.blockTitle} ${styles.glowTextEffect}`}>
          ABOUT THE ARTIST
        </h1>
        <div className={styles.description}>
          <p>
            Painting is an intense moment of escape and expression. My palette
            knives are the guides for my emotions on the canvas. My paintings
            are a reflection of what is within me, that which I can only express
            through the material, colors, and abstraction.
          </p>
          <div className={styles.image}>
            <Image
              src="/Jessica.jpg"
              alt="Jessica"
              height="900"
              width="900"
              quality="95"
              priority={true}
            />
          </div>
        </div>
      </div>
      <div className={styles.blockContainer}>
        <h1 className={`${styles.blockTitle} ${styles.glowTextEffect}`}>
          HOW DOES IT WORK?
        </h1>
        <div className={styles.videoContainer}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/we-mm6V6H00"
            title="YouTube Video"
            frameborder="0"
            allow="accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
