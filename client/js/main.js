/**
 * Connecting to ethereum with MetaMask:
 *
 *
 * see these:
 * https://ethereum.stackexchange.com/a/132279/92641
 * https://blog.valist.io/how-to-connect-web3-js-to-metamask-in-2020-fee2b2edf58a
 *
 *
 * We need to create a new Web3() [web3.js library] instance.
 * To create that instance we need to provide a **provider** as an instance.
 *
 * so that afterwards we can get the accounts:
 * we can use web3.eth.getAccounts() like the old days.
 *
 * As of right now "window.ethereum" itself is a provider [availibe in the mordern ethereum enabled and updated metamask installed browsers],
 *
 * First step, is to ask for the permission of the enduser to use the account in their metamask
 *
 * const addreses = await window.ethereum.request({
 *    method: "eth_requestAccounts"
 * });
 *
 * // window.ethereum.enable() or send() does the same but deprecated
 * // const addreses (the returned array is not needed as we can get that later after our web3 instansiation)
 *
 * Second step, creating the instansiation
 *    const web3 = new Web3(window.ethereum);
 *
 * last step, getting the accounts
 *
 *    const accounts = await web3.eth.getAccounts()
 *
 * for Metamask we need the "await" for test RPC we don't
 *
 */

/**
 * Connecting to ethereum with testRPC:
 *
 * for a testRPC we need to create a provider for us, in metamask's case it was injecting a providre in the browser and we
 * could get that using "window.ethereum".
 *
 * to create a provider for testRPC:
 *  web3Provider = new Web3.providers.HttpProvider("http://localhost:8545"); // just add the address/ can be remote also
 *
 *
 * finally creating the instansiation
 *    const web3 = new Web3(web3Provider); // same as metamask
 */

$(document).ready(async () => {
  // trying to establish connection to a provider
  const web3 = await establishConnection();

  const accounts = await web3.eth.getAccounts();

  console.log("accounts", accounts);

  $("#send-eth").click(sendEther);
});

const establishConnection = async () => {
  let web3Provider;
  // Handler for .ready() called.
  // Modern dapp browsers...
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      web3Provider = window.ethereum;
      //   console.log("onReq", addreses);
      //   console.log("window.ethereum", window.ethereum);
    } catch (error) {
      // User denied account access...
      console.error("User denied account access", error);
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log("Please connect to MetaMask.");
      } else {
        console.error(error);
      }
    }
  }

  //   Legacy dapp browsers...
  else if (window.web3) {
    web3Provider = window.web3.currentProvider;
  }

  //    // for production
  //   else{
  //     console.error("Please install MetaMask");
  //   }

  // for test only
  // If no injected web3 instance is detected, fall back to localchain
  else {
    web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
  }

  const web3 = new Web3(web3Provider);

  return web3;
};

const sendEther = () => {
  console.log("send");
};
