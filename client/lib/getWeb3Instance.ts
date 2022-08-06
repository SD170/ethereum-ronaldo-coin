import Web3 from "web3";
const createWeb3Instance = async () => {

    if (!window.ethereum) {
        throw new Error("Please install Metamask");
    }
    const web3Instance = new Web3(window.ethereum);
    // console.log(web3);
    try {
        // @ts-ignore
        const accountsInstance = await web3.currentProvider.request({
            method: "eth_requestAccounts"
        });
        console.log(web3Instance);
        if (accountsInstance.length > 0) {
            return { web3Instance, accountsInstance };


        } else {
            throw new Error("No address on meamask");
        }

    } catch (error: any) {
        throw new Error(`error getting accounts on Meamask: ${error}`);
    }


}

const getWeb3Instance = async () => {
    if (document.readyState === 'complete') {

        try {
            return await createWeb3Instance();
        } catch (error: any) {
            throw new Error(error);
        }
    } else {
        document.onreadystatechange = async () => {
            if (document.readyState === 'complete') {
                try {
                    return await createWeb3Instance();
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        }
    }

}

export default getWeb3Instance;