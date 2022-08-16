import Web3 from 'web3';
import { Contract } from "web3-eth-contract";

const getEstimations = async (web3: Web3, accounts: Array<string>, tokenContract: Contract) => {
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
    } catch (error: any) {

        // just for better display
        if (error.message.includes("You can own at max 1 RonaldoCoin")) {
            throw new Error("You can own at max 1 RonaldoCoin, not more. Don't be greedy")
        } else if (error.message.includes("All 20 RonaldoCoin are minted")) {
            throw new Error("All 20 RonaldoCoin are minted. You're late.")
        } else if (error.message.includes("RonaldoCoin's price is not met")) {
            throw new Error("RonaldoCoin's price is not met")
        }else if (error.message.includes("No need to pay that much!!")) {
            throw new Error("No need to pay that much!! donate to charity instead.")
        }

        const revertMsg = "execution reverted";
        const revertIdx = error.toString().indexOf(revertMsg);
        if (revertIdx != -1) {
            const err = error.toString().slice(revertIdx + revertMsg.length)
            throw new Error(err);
        }
        throw error;
    }
}

export default getEstimations;