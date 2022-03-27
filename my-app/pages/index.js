// jshint esversion: 9
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Web3Modal from "web3modal";
import { useEffect, useRef, useState } from "react";
import {abi, CONTRACT_ADDRESS} from "../constants";
import { BigNumber, Contract, providers, utils } from "ethers";


export default function Home() {

    // walletConnected keeps track of whether the user's wallet is connected or not
    const [walletConnected, setWalletConnected] = useState(false);
    // loading is set to true when we are waiting for a transaction to get mined
    // const [loading, setLoading] = useState(false);
    // const [rewardToBeClaimed, setRewardToBeClaimed] = useState(zero);
    // balanceOfCryptoDevTokens keeps track of number of owned by an address
    const [balanceOfToken, setBalanceOfToken] = useState(0);
    // amount of the tokens that the user wants to mint
    const [stakeAmount, setStakeAmount] = useState(0);
    // amount of the tokens that the user wants to stake
    const [tokenStaked, setTokenStaked] = useState(0);
    // tokensMinted is the total number of tokens that have been minted till now out of 10000(max total supply)
    const [tokensMinted, setTokensMinted] = useState(0);
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

    } catch (err) {
      console.error(err);
    }
  };
  const getBalanceOfUserToken = async () => {
    try {

      const provider = await getProviderOrSigner();
      // Create an instace of token contract
      const tokenContract = new Contract(
        CONTRACT_ADDRESS,
        abi,
        provider
      );
      // We will get the signer now to extract the address of the currently connected MetaMask account
      const signer = await getProviderOrSigner(true);
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      // call the balanceOf from the token contract to get the number of tokens held by the user
      const balance = await tokenContract.balanceOf(address);
      // balance is already a big number, so we dont need to convert it before setting it
      setBalanceOfToken(balance);
    } catch (err) {
      console.error(err);
      setBalanceOfToken(0);
    }
  };

  const getTotalTokensStaked = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // Create an instance of token contract
      const tokenContract = new Contract(
        CONTRACT_ADDRESS,
        abi,
        provider
      );
      // Get all the tokens that have been minted
      const _tokensMinted = await tokenContract.totalSupply();
      setTokensStaked(_tokensMinted);
    } catch (err) {
      console.error(err);
    }
  };

  const getTotalTokensMinted = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // Create an instance of token contract
      const tokenContract = new Contract(
        CONTRACT_ADDRESS,
        abi,
        provider
      );
      // Get all the tokens that have been minted
      const _tokensMinted = await tokenContract.totalSupply();
      setTokensMinted(_tokensMinted);
    } catch (err) {
      console.error(err);
    }
  };
  /**
   * mintToken: mints `amount` number of tokens to a given address
   */
   const mintToken = async (amount) => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      // Create an instance of tokenContract
      const signer = await getProviderOrSigner(true);
      // Create an instance of tokenContract
      const tokenContract = new Contract(
        CONTRACT_ADDRESS,
        abi,
        signer
      );
      // Each token is of `0.001 ether`. The value we need to send is `0.001 * amount`
      const value = 0.001 * amount;
      const tx = await tokenContract.mint(amount, {
        // value signifies the cost of one crypto dev token which is "0.001" eth.
        // We are parsing `0.001` string to ether using the utils library from ethers.js
        value: utils.parseEther(value.toString()),
      });
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      window.alert("Sucessfully minted Crypto Dev Tokens");
      await getBalanceOfUserToken();
      await getTotalTokensMinted();
      await getTotalTokensStaked();
      await getTokensToBeClaimed();
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * claimCryptoDevTokens: Helps the user claim Crypto Dev Tokens
   */
  const claimTokens = async () => {
    try {
      // We need a Signer here since this is a 'write' transaction.
      // Create an instance of tokenContract
      const signer = await getProviderOrSigner(true);
      // Create an instance of tokenContract
      const tokenContract = new Contract(
        CONTRACT_ADDRESS,
        abi,
        signer
      );
      const tx = await tokenContract.claim();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      setLoading(false);
      window.alert("Sucessfully claimed Crypto Dev Tokens");
      await getBalanceOfUserToken();
      await getTotalTokensMinted();
      await getTotalTokensStaked();
      await getTokensToBeClaimed();
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * getTokensToBeClaimed: checks the balance of tokens that can be claimed by the user
   */
   const getTokensToBeClaimed = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // Create an instance of NFT Contract
      const nftContract = new Contract(
        CONTRACT_ADDRESS,
        abi,
        provider
      );
      // Create an instance of tokenContract
      const tokenContract = new Contract(
        CONTRACT_ADDRESS,
        abi,
        provider
      );
      // We will get the signer now to extract the address of the currently connected MetaMask account
      const signer = await getProviderOrSigner(true);
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      // call the balanceOf from the NFT contract to get the number of NFT's held by the user
      const balance = await nftContract.balanceOf(address);
      // balance is a Big number and thus we would compare it with Big number `zero`
      if (balance === zero) {
        setTokensToBeClaimed(zero);
      } else {
        // amount keeps track of the number of unclaimed tokens
        var amount = 0;
        // For all the NFT's, check if the tokens have already been claimed
        // Only increase the amount if the tokens have not been claimed
        // for a an NFT(for a given tokenId)
        for (var i = 0; i < balance; i++) {
          const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
          const claimed = await tokenContract.tokenIdsClaimed(tokenId);
          if (!claimed) {
            amount++;
          }
        }
        //tokensToBeClaimed has been initialized to a Big Number, thus we would convert amount
        // to a big number and then set its value
        setTokensToBeClaimed(BigNumber.from(amount));
      }
    } catch (err) {
      console.error(err);
      setTokensToBeClaimed(zero);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Rinkeby network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Change the network to Rinkeby");
      throw new Error("Change network to Rinkeby");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

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
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <h2>{utils.formatEther(balanceOfToken)}ETH</h2>
            <p className={styles.cardTitle}>Balance</p>
          </div>
          <div className={styles.card}>
            <h2>{utils.formatEther(tokenStaked)}ETH</h2>
            <p className={styles.cardTitle}>Total Staked</p>
          </div>
        </div>
        {walletConnected ? (
          <div className={styles.content}>
            <div className={styles.stakeContent}>
              <input type="number" placeholder='amount to transfer' className={styles.input} />
              <button type='submit' className={styles.button}>Transfer</button>
            </div>
            <div className={styles.stakeContent}>
              <input type="number" placeholder='amount to stake' className={styles.input} />
              <button type='submit'className={styles.button}>Stake</button>
            </div>
            <div className={styles.stakeContent}>
              <input type="number" placeholder='amount to withdraw' className={styles.input} />
              <button type='submit'className={styles.button}>Unstake</button>
            </div>
          </div>
        ): (
          <button className={styles.button}>Connect Wallet</button>
        )}
      </div>
    </div>
  )
}
