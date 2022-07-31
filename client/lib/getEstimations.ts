import Web3 from 'web3';
// @ts-ignore
const getEstimations = async (web3: Web3, accounts: Array<string>, tokenContract) => {
    try {
        // current gas price:
        const gasPrice = await web3.eth.getGasPrice();
        // estimate gas price:
        const gas = await web3.eth.estimateGas({
            // @ts-ignore
            to: tokenContract._address,
            from: accounts[0],
            data: "0x",
            value: web3.utils.toHex(web3.utils.toWei(".0001", "ether"))
        });

        return { gas, gasPrice };
    } catch (error:any) {
        throw new Error(error);
    }
}

export default getEstimations;