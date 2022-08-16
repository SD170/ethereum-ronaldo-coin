import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
// import styles from "../styles/Home.module.css";
// import styles from "../styles/Index.module.css";
import getWeb3Instance from "../lib/getWeb3Instance";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Web3 from "web3";
import getEstimations from "../lib/getEstimations";
import ListTokens from "../components/ListTokens";
import { ownerData, ownerDataRedis } from "../interfaces";
import getContractInstance from "../lib/getContractInstance";
import contractInterface from "../../truffle/build/contracts/RonaldoCoinCapped.json";
import Navbar from "../components/Navbar";
// import { closeConnection } from '../lib/redis/services';
import { ToastContainer, toast, ToastOptions, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Toast from "../components/Toast";
import PostBuyModal from "../components/PostBuyModal";

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
      const { web3Instance, accountsInstance } = await getWeb3Instance();
      setWeb3(web3Instance);
      setAccounts(accountsInstance);
      if (accountsInstance > 0) {
        // console.log(accountsInstance);
        setIsMMConnected(true);
      }
    } catch (error: any) {
      console.error(error);
      showToast(error.message, "error");
    }
  }, []); // setIsMMConnected is already memoised as setState()'s are as per react. So no need to include it in the dependency array

  const showToast = (message: string, type: string = "info") => {
    const options: ToastOptions = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Flip
    };
    if (type === "error") {
      toast.error(message, options);
    } else if (type === "success") {
      toast.success(message, options);
    } else {
      toast.info(message, options);
    }
  };
  useEffect(() => {
    // web3Context();
    // console.log("objectobjectobject", web3);
    // // @ts-ignore
    // console.log(window.ethereum.selectedAddress);
    // if(window.ethereum.selectedAddress){
    //   setIsMMConnected(true);
    // }
  }, []);

  // useEffect(() => {
  //   web3Context();
  //   /**
  //    * for listening to change in accounts
  //    */
  //   // window.ethereum.on("accountsChanged", (accounts: Array<string>) => {
  //   //   if (accounts.length > 0) {
  //   //     // console.log(accounts);
  //   //     setIsMMConnected(true);
  //   //   }
  //   // });
  // }, [web3Context]);

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
    console.log("result of getAllOwners api", result[0].createdAt );
    console.log("result of getAllOwners api", new Date(result[0].createdAt));
    setTokenOwners(result);

    // setTokenOwners([
    //   {
    //     address: "0xf99bf87663f0e27619b914ef7696e9e352395977",
    //     createdAt: "null",
    //     entityId: "01G9SARKDNZXJ4XMBJY13ZS5C4",
    //     name: "testing",
    //     note: "sadf"
    //   }
    // ]);
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
              // alert("Thanks for buying");
              showToast("Thanks for buying RON", "success");
              // show modal
              getCoinLeft();
              setPostBuyModal(true);
            }
          }
        );
      } catch (error: any) {
        console.log(error);
        showToast(error.message, "error");
      }
    }
  }, [tokenContract, web3, accounts]);

  const handlePostBuy = async (e: FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const formData = Object.fromEntries(form.entries());
    formData.address = accounts[0]; // adding current account
    formData.createdAt = Date.now().toString(); // adding date
    formData.name = formData.name ? formData.name : "Anonymous";
    formData.note = formData.note ? formData.note : "Empty";
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

    showToast("You can see your RON now", "success");
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
  }, [getCoinLeft]);

  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {/* <Toast message="sss" /> */}
      <ToastContainer />
      <div className="flex justify-center my-5">
        {/* {!tokenLeft && (
          <div className="block p-6 max-w-xs bg-white rounded-lg border border-red-600 shadow-md dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 ">
            <h5 className="text-2xl tracking-tight text-gray-900 dark:text-white">
              <div className="flex items-center">
                <img
                  src="/RON-logo.gif"
                  // className="mr-3 h-6 sm:h-9"
                  className="mr-2 -ml-1 w-10 h-11"
                  alt="Flowbite Logo"
                  //   width={36}
                  //   height={24}
                />{" "}
                <div className="">left:</div>{" "}
                <span className="font-bold">{tokenLeft}</span>
              </div>
            </h5>
          </div>
        )} */}
        <span>
          <button
            type="button"
            className="shadow-sm text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2 hover:cursor-default"
          >
            <span className="flex items-center">
              <img
                src="/RON-logo.gif"
                // className="mr-3 h-6 sm:h-9"
                className="mr-2 -ml-1 w-10 h-11"
                alt="Flowbite Logo"
                //   width={36}
                //   height={24}
              />
              <div className="">left: </div>
              <span className="font-bold text-red-600">{tokenLeft?tokenLeft:"??"}</span>
            </span>
          </button>
        </span>

        <button
          type="button"
          disabled={isMMConnected}
          onClick={web3Context}
          className={`shadow-sm text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2 disabled:cursor-not-allowed ${!isMMConnected && ' !border-red-600'}`}
        >
          <Image
            src="/metamask.svg"
            alt="metamask logo "
            width={72}
            height={50}
          />
          {isMMConnected ? <>Connected....</> : <>Connect with MetaMask</>}
        </button>
        <span
          onMouseEnter={() => {
            if (!isMMConnected) {
              showToast("Please connect to metamask first!", "warning");
            }
          }}
        >
          <button
            type="button"
            disabled={!isMMConnected}
            onClick={buyToken}
            className={`shadow-sm text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2 disabled:cursor-not-allowed ${isMMConnected && ' !border-red-600'}`}
          >
            <img
              src="/RON-logo.gif"
              // className="mr-3 h-6 sm:h-9"
              className="mr-2 -ml-1 w-10 h-11"
              alt="Flowbite Logo"
              //   width={36}
              //   height={24}
            />
            Buy a RON
          </button>
        </span>

        {/* <button className="" disabled={isMMConnected} onClick={web3Context}>
          connect to metamask
        </button>
        <button className="" disabled={!isMMConnected} onClick={buyToken}>
          buy a ronaldocoin
        </button> */}
      </div>

      {/* <div className="" hidden={!postBuyModal}>
        <form onSubmit={handlePostBuy}>
          <input type="text" name="name" />
          <input type="text" name="note" />
          <input type="submit" value={"Save"} />
          <input type="submit" value={"Cancle"} />
        </form>
      </div> */}
      {postBuyModal && <PostBuyModal handlePostBuy={handlePostBuy} />}

      {/* <div className="">tokenLeft: {tokenLeft}</div> */}
      <ListTokens tokenOwners={tokenOwners} />
    </div>
  );
};

export default Home;
