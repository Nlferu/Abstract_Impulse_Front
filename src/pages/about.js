import styles from '@/styles/About.module.css'
import Image from "next/image"
import Jessica1 from '../../public/Jessica1.JPG'

export default function About() {
    return (
        <div className={styles.container}>
            <div className={styles.blockContainer}>
                <h1 className={`${styles.blockTitle} ${styles.glowTextEffect}`}>
                    ABOUT THE ARTIST
                </h1>
                <div className={styles.description}>
                    <p>Painting is an intense moment of escape and expression. My palette knives are the guides for my emotions on the canvas. My paintings are a reflection of what is within me, that which I can only express through the material, colors, and abstraction.</p>
                    <div className={styles.image}>
                        <Image
                            src={Jessica1}
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
                        width="900"
                        height="600"
                        src="https://www.youtube.com/embed/we-mm6V6H00"
                        title="YouTube Video"
                        frameborder="0"
                        allow="accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture"
                        allowfullscreen
                    ></iframe>
                </div>
            </div>
        </div>
    )
}