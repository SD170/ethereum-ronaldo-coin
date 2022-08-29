import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import getWeb3Instance from "../lib/getWeb3Instance";
import { FormEvent, useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import getEstimations from "../lib/getEstimations";
import ListTokens from "../components/ListTokens";
import { ownerDataRedis } from "../interfaces";
import getContractInstance from "../lib/getContractInstance";
import contractInterface from "../contracts/RonaldoCoinCapped.json";
import Navbar from "../components/Navbar";
import { ToastContainer, toast, ToastOptions, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Toast from "../components/Toast";
import PostBuyModal from "../components/PostBuyModal";
import { Contract } from "web3-eth-contract";

const RONALDOCOINPRICE = "0.0001"; // in ether

const Home: NextPage = () => {
  const [isMMConnected, setIsMMConnected] = useState(false);
  const [accounts, setAccounts] = useState<Array<string>>([]); // maybe ref
  const [tokenContract, setTokenContract] = useState<Contract>(); // maybe ref
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [postBuyModal, setPostBuyModal] = useState(false);
  const [tokenOwners, setTokenOwners] = useState<ownerDataRedis[]>([]);
  const [tokenLeft, setTokenLeft] = useState<number | null>(null);

  const web3Context = useCallback(async () => {
    try {
      const instance = await getWeb3Instance();
      if (instance) {
        const { web3Instance, accountsInstance } = instance;
        setWeb3(web3Instance);
        setAccounts(accountsInstance);
        if (accountsInstance > 0) {
          setIsMMConnected(true);
        }
      }
    } catch (error: any) {
      console.error(error);
      showToast(error.message, "error");
    }
  }, []); // setIsMMConnected is already memoised as setState()'s are as per react. So no need to include it in the dependency array

  const contractContext = useCallback(async () => {
    if (web3) {
      const contractInstance = await getContractInstance(
        web3,
        contractInterface
      );
      //@ts-ignore
      setTokenContract(contractInstance);
    }
  }, [web3]);

  const getAllOwners = useCallback(async () => {
    const res = await fetch("/api/getOwners", {
      method: "GET"
    });

    const result = await res.json();
    setTokenOwners(result);

    // dummy owner
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

  const buyToken = useCallback(async () => {
    if (tokenContract && web3 && accounts.length) {
      try {
        const { gas, gasPrice } = await getEstimations(
          web3,
          accounts,
          tokenContract
        );
        // for params specification:
        // https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction
        const params = [
          {
            from: accounts[0],
            // @ts-ignore
            to: tokenContract._address,
            gas: web3.utils.toHex(gas),
            gasPrice: web3.utils.toHex(gasPrice),
            value: web3.utils.toHex(web3.utils.toWei(RONALDOCOINPRICE, "ether"))
          }
        ];
        // metamask transaction
        // @ts-ignore
        const tId = await web3.currentProvider.request({
          method: "eth_sendTransaction",
          params
        });
        showToast("Wait a few seconds", "info");
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
        showToast(error.message, "error");
      }
    }
  }, [tokenContract, web3, accounts]);

  const getCoinLeft = useCallback(async () => {
    if (tokenContract) {
      const tokenLeftCount = await tokenContract.methods.getTokenLeft().call();
      setTokenLeft(tokenLeftCount);
    }
  }, [tokenContract]);

  const handlePostBuy = async (e: FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const formData = Object.fromEntries(form.entries());
    formData.address = accounts[0]; // adding current account
    formData.createdAt = Date.now().toString(); // adding date
    formData.name = formData.name ? formData.name : "Anonymous";
    formData.note = formData.note ? formData.note : "Empty";

    const res = await fetch("/api/addOwner", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await res.json();
    // rerendering all owners
    await getAllOwners();

    showToast("You can see your RON now", "success");
    setPostBuyModal(false);
  };

  const showToast = (message: string, type: string = "info") => {
    const options: ToastOptions = {
      position: "bottom-right",
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
    contractContext();
  }, [contractContext]);

  useEffect(() => {
    console.log("All tokens", tokenOwners);
    getAllOwners();
  }, [getAllOwners]);

  useEffect(() => {
    getCoinLeft();
  }, [getCoinLeft]);

  /**
   * loading context on page load
   */
  // useEffect(() => {
  // web3Context();
  // // @ts-ignore
  // console.log(window.ethereum.selectedAddress);
  // if(window.ethereum.selectedAddress){
  //   setIsMMConnected(true);
  // }
  // }, []);

  /**
   * for listening to change in accounts
   */
  // useEffect(() => {
  //   web3Context();
  //   // window.ethereum.on("accountsChanged", (accounts: Array<string>) => {
  //   //   if (accounts.length > 0) {
  //   //     // console.log(accounts);
  //   //     setIsMMConnected(true);
  //   //   }
  //   // });
  // }, [web3Context]);

  return (
    <div className="">
      <Head>
        <title>Ronaldo Coin</title>
        <meta name="description" content="Home page of Ronaldo Coin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {/* <Toast message="sss" /> */}
      <ToastContainer />
      <div className="flex justify-center my-5">
        <span>
          <button
            type="button"
            className="shadow-sm text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center      mr-2 mb-2 hover:cursor-default"
          >
            <span className="flex items-center">
              <img
                src="/RON-logo.gif"
                // className="mr-3 h-6 sm:h-9"
                className="mr-2 -ml-1 w-10 h-11"
                alt="RON logo"
                //   width={36}
                //   height={24}
              />
              <div className="">left: </div>
              <span className="font-bold text-red-600">
                {tokenLeft ? tokenLeft : "??"}
              </span>
            </span>
          </button>
        </span>

        <button
          type="button"
          disabled={isMMConnected}
          onClick={web3Context}
          className={`shadow-sm text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center      mr-2 mb-2 disabled:cursor-not-allowed ${
            !isMMConnected && " !border-red-600"
          }`}
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
            className={`shadow-sm text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center      mr-2 mb-2 disabled:cursor-not-allowed ${
              isMMConnected && " !border-red-600"
            }`}
          >
            <img
              src="/RON-logo.gif"
              // className="mr-3 h-6 sm:h-9"
              className="mr-2 -ml-1 w-10 h-11"
              alt="RON Logo"
              //   width={36}
              //   height={24}
            />
            Buy a RON
          </button>
        </span>
      </div>

      {postBuyModal && <PostBuyModal handlePostBuy={handlePostBuy} />}

      <ListTokens tokenOwners={tokenOwners} />
    </div>
  );
};

export default Home;
