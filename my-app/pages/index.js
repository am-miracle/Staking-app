  
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from "react";
import {abi, CONTRACT_ADDRESS} from "../constants";
import styles from '../styles/Home.module.css'

export default function Home() {

    // walletConnected keeps track of whether the user's wallet is connected or not
    const [walletConnected, setWalletConnected] = useState(false);
    // loading is set to true when we are waiting for a transaction to get mined
    const [loading, setLoading] = useState(false);
    // tokensToBeClaimed keeps track of the number of tokens that can be claimed
    // based on the Crypto Dev NFT's held by the user for which they havent claimed the tokens
    const [rewardToBeClaimed, setRewardToBeClaimed] = useState(zero);
    // balanceOfCryptoDevTokens keeps track of number of Crypto Dev tokens owned by an address
    const [balanceOfToken, setBalanceOfToken] = useState(zero);
    // amount of the tokens that the user wants to mint
    const [tokenAmount, setTokenAmount] = useState(zero);
    // amount of the tokens that the user wants to mint
    const [tokenStaked, setTokenStaked] = useState(zero);
    // tokensMinted is the total number of tokens that have been minted till now out of 10000(max total supply)
    const [tokensMinted, setTokensMinted] = useState(zero);
    // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
    const web3ModalRef = useRef();

  /*
    connectWallet: Connects the MetaMask wallet
  */
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (err) {
      console.error(err);
    }
  };

    // useEffects are used to react to changes in state of the website
  // The array at the end of function call represents what state changes will trigger this effect
  // In this case, whenever the value of `walletConnected` changes - this effect will be called
  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);
  
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
