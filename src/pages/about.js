import styles from '@/styles/About.module.css'

export default function About() {
    return (
        <div className={styles.container}>
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
            <h1 className={`${styles.blockTitle} ${styles.glowTextEffect}`}>
                ABOUT THE ARTIST
            </h1>
            <div>
                <p>This will be the description of the artist</p>
                <p>This will be the description of the artist</p>
                <p>This will be the description of the artist</p>
                <p>This will be the description of the artist</p>
                <p>This will be the description of the artist</p>
                <p>This will be the description of the artist</p>
                <p>This will be the description of the artist</p>
            </div>
        </div>
    )
}