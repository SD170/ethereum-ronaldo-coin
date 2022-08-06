import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import getWeb3Instance from "../lib/getWeb3Instance";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Web3 from "web3";
import getEstimations from "../lib/getEstimations";
import ListTokens from "../components/ListTokens";
import { ownerData, ownerDataRedis } from "../interfaces";
import getContractInstance from "../lib/getContractInstance";
import contractInterface from "../../truffle/build/contracts/RonaldoCoinCapped.json";
// import { closeConnection } from '../lib/redis/services';

const RONALDOCOINPRICE = "0.0001"; // in ether

const Home: NextPage = () => {
  const [isMMConnected, setIsMMConnected] = useState(false);
  const [accounts, setAccounts] = useState<Array<string>>([]); // maybe ref
  const [tokenContract, setTokenContract] = useState(null); // maybe ref
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [postBuyModal, setPostBuyModal] = useState(false);
  const [tokenOwners, setTokenOwners] = useState<ownerDataRedis[]>([]);
  const [tokenLeft, setTokenLeft] = useState<number | null>(null);

  const web3Context = useCallback(async () => {
    try {
      // @ts-ignore
      const { web3Instance, accountsInstance, contractInstance } =
        await getWeb3Instance();
      setWeb3(web3Instance);
      setAccounts(accountsInstance);
      if (accountsInstance > 0) {
        // console.log(accountsInstance);
        setIsMMConnected(true);
      }
    } catch (error) {
      console.error(error);
    }
  }, []); // setIsMMConnected is already memoised as setState()'s are as per react. So no need to include it in the dependency array
  useEffect(() => {
    web3Context();
    /**
     * for listening to change in accounts
     */
    // window.ethereum.on("accountsChanged", (accounts: Array<string>) => {
    //   if (accounts.length > 0) {
    //     // console.log(accounts);
    //     setIsMMConnected(true);
    //   }
    // });
  }, [web3Context]);

  const contractContext = useCallback(async () => {
    if (web3) {
      const contractInstance = await getContractInstance(
        web3,
        contractInterface
      );
      // @ts-ignore
      setTokenContract(contractInstance);
    }
  }, [web3]);

  useEffect(() => {
    contractContext();
  }, [contractContext]);

  const getAllOwners = useCallback(async () => {
    const res = await fetch("/api/getOwners", {
      method: "GET"
    });

    const result = await res.json();
    // console.log("result of getAllOwners api", result);
    setTokenOwners(result);
  }, []); // setTokenOwners is already memoised as setState()'s are as per react. So no need to include it in the dependency array

  useEffect(() => {
    console.log("tokenOwners", tokenOwners);
    getAllOwners();
  }, [getAllOwners]);

  // useEffect(() => {
  //   interface ProviderMessage {
  //     type: string;
  //     data: unknown;
  //   }

  //   web3?.eth.subscribe(
  //     "logs",
  //     {
  //       // fromBlock:1,
  //       // @ts-ignore
  //       address: tokenContract._address,
  //       // topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]
  //     },
  //     function (error, result) {
  //       if (!error) {
  //         console.log("result of logs", result);
  //         alert("Thanks for buying")
  //       }
  //     }
  //   );

  // }, [web3Context, txnId]);

  const buyToken = useCallback(async () => {
    console.log(tokenContract && web3 && accounts.length);
    if (tokenContract && web3 && accounts.length) {
      try {
        const { gas, gasPrice } = await getEstimations(
          web3,
          accounts,
          tokenContract
        );
        // console.log("gas", gas);
        // for params specification:
        // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction
        // @ts-ignore
        const params = [
          {
            from: accounts[0],
            // @ts-ignore
            to: tokenContract._address,
            gas: web3.utils.toHex(gas),
            gasPrice: web3.utils.toHex(gasPrice),
            value: web3.utils.toHex(web3.utils.toWei(".0001", "ether"))
          }
        ];
        // metamask transaction
        // @ts-ignore
        const tId = await web3.currentProvider.request({
          method: "eth_sendTransaction",
          params
          // @ts-ignore
        });

        web3?.eth.subscribe(
          "logs",
          {
            // fromBlock:1,
            // @ts-ignore
            address: tokenContract._address,
            topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
            ] // Keccak-256 hash of Transfer event
          },
          function (error, result) {
            if (!error) {
              // console.log("result of logs", result);
              alert("Thanks for buying");
              // show modal
              getCoinLeft();
              setPostBuyModal(true);
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  }, [tokenContract, web3, accounts]);

  const handlePostBuy = async (e: FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const formData = Object.fromEntries(form.entries());
    formData.address = accounts[0]; // adding current account
    formData.createdAt = Date.now().toString(); // adding date
    console.log("formData", formData);

    const res = await fetch("/api/addOwner", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await res.json();
    console.log("result of addOwner api", result);
    // rerendering all owners
    await getAllOwners();
    setPostBuyModal(false);
  };

  const getCoinLeft = useCallback(async () => {
    console.log("getCoinLeft");
    if (tokenContract) {
      // @ts-ignore
      const tokenLeftCount = await tokenContract.methods.getTokenLeft().call();
      setTokenLeft(tokenLeftCount);
    }
  }, [tokenContract]);

  useEffect(() => {
    getCoinLeft();
  }, [buyToken, getCoinLeft]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button disabled={isMMConnected} onClick={web3Context}>
        connect to metamask
      </button>

      <button disabled={!isMMConnected} onClick={buyToken}>
        buy a ronaldocoin
      </button>

      <div className="" hidden={!postBuyModal}>
        <form onSubmit={handlePostBuy}>
          <input type="text" name="name" />
          <input type="text" name="note" />
          <input type="submit" value={"Save"} />
          <input type="submit" value={"Cancle"} />
        </form>
      </div>

      <div className="">tokenLeft: {tokenLeft}</div>
      <ListTokens tokenOwners={tokenOwners} />

      {/* <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  );
};

export default Home;
