// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/*
Contract for the RonaldoCoin Token
*/

import "./ERC20.sol";

contract RonaldoCoin is ERC20 {
    uint8 private tokenDecimals;    // changing the total supply
    // uint256 private tokenTotalSupply;   // changing the total supply

    constructor(string memory tokenName, string memory tokenSymbol) ERC20(tokenName, tokenSymbol) {
        tokenDecimals = 0; // no need for fractions.
        mintToken(msg.sender, 10);
    }
}