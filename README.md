[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SD170/ethereum-ronaldo-coin)
# Ethereum Ronaldo Coin (RON)

RON is a layer 2 token(ERC-20) deployed on Ropsten(ETH) TESTNET. The smart contract is written in solidity on truffle. The dApp is built using Next.js. Redis is used as the primary datastore. Deployed on Vercel platform. Used TypeScript with React for developing the frontend.


## Important files

The directory is divided into two folders. `/truffle` holds all files regarding the smart contract. `/client` is for the next.js files for the dApp.

| Directory | Link and Description |
| ------ | ------ |
| /truffle/contracts | [`Holds the ERC20 contracts and interfaces, RonaldoCoin contract.`](https://github.com/SD170/ethereum-ronaldo-coin/tree/next-js/truffle/contracts) |
| /truffle/test | [`Unit tests using Chai and Mocha.`](https://github.com/SD170/ethereum-ronaldo-coin/tree/next-js/truffle/test) |
| /client/pages/index | [`Holds the entrypoint to the next.js dApp.`](https://github.com/SD170/ethereum-ronaldo-coin/blob/next-js/client/pages/index.tsx) |
| /client/lib | [`Ethereum provider setup with Metamask, for connecing to Ropsten.`](https://github.com/SD170/ethereum-ronaldo-coin/tree/next-js/client/lib) |
| /client/lib/redis | [`Redis schema using Redis OM.`](https://github.com/SD170/ethereum-ronaldo-coin/tree/next-js/client/lib/redis) |
| /client/pages/api | [`API to communicate with redis cloud.`](https://github.com/SD170/ethereum-ronaldo-coin/tree/next-js/client/pages/api) |


## Usage
1) Clone the project.
    ```
    git clone https://github.com/SD170/ethereum-ronaldo-coin
    ```
2) Change directory.
    ```
    cd client
    ```
3)  Install the dependencies. Use `pnpm`.

    ```
    pnpm install
    ```
4)  Add a ".env" file to the project root directory.
    
    ```
    touch .env.local
    echo REDIS_URL=<your redis url> >> .env.local
    ```

5)  Build project.

    ```
    npm run build
    ```

6)  run project.

    ```
    npm start
    ```



## Tech-stack

- [Solidity](https://github.com/ethereum/solidity) - For Smart contract development
- [Truffle](https://trufflesuite.com/) - For Smart contract development
- [Next.Js](https://nextjs.org/) - For dApp development
- [Vercel](https://vercel.com/) - For dApp deployment


### Thanks for checking out
