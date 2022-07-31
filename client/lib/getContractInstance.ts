import Web3 from "web3";

// @ts-ignore
const getContractInstance = async (web3Instance: Web3, contractInterface) => {
    try {
        const networkID = await web3Instance.eth.net.getId()
        // @ts-ignore
        const address = contractInterface.networks[networkID].address
        // @ts-ignore
        const contractInstance = new web3Instance.eth.Contract(contractInterface.abi, address);
        return contractInstance;
    } catch (error) {
        throw new Error(`error creating contract: ${error}`);
    }

}

export default getContractInstance;