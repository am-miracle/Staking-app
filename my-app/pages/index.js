import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Staking App</title>
        <meta name="Staking App" content="Simple UI for a Staking App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <h2>1000ETH</h2>
            <p className={styles.cardTitle}>Balance</p>
          </div>
          <div className={styles.card}>
            <h2>10ETH</h2>
            <p className={styles.cardTitle}>Total Staked</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.stakeContent}>
            <input type="number" placeholder='amount to transfer' className={styles.input} />
            <button type='submit' className={styles.button}>Transfer</button>
          </div>
          <div className={styles.stakeContent}>
            <input type="number" placeholder='amount to stake' className={styles.input} />
            <button type='submit'className={styles.button}>Stake</button>
          </div>
        </div>
      </div>

    </div>
  )
}
