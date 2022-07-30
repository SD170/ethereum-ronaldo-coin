// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

/*
Contract for the RonaldoCoin Token
*/

import "./ERC20.sol";

contract RonaldoCoin is ERC20 {
    constructor(string memory tokenName, string memory tokenSymbol)
        ERC20(tokenName, tokenSymbol)
    {
        uint8 tokenMinted = 100; // change it if you want to mint more
        mintToken(msg.sender, tokenMinted * 10**uint256(decimals()));
    }
    
}
