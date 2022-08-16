import Web3 from "web3";

const getContractInstance = async (web3Instance: Web3, contractInterface:any) => {
    try {
        const networkID = await web3Instance.eth.net.getId()
        const address = contractInterface.networks[networkID].address
        const contractInstance = new web3Instance.eth.Contract(contractInterface.abi, address);
        return contractInstance;
    } catch (error) {
        throw new Error(`error creating contract: ${error}`);
    }

}

export default getContractInstance;