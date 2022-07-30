// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

/*
Contract for the RonaldoCoin Token
*/

import "./ERC20.sol";

contract RonaldoCoinCapped is ERC20 {
    address tokenOwner;

    constructor(string memory tokenName, string memory tokenSymbol)
        ERC20(tokenName, tokenSymbol)
    {
        tokenOwner = msg.sender;
        uint8 tokenMinted = 10; // I want to keep the cap to 10. Change it if you want to mint more
        mintToken(msg.sender, tokenMinted * 10**uint256(decimals()));
    }

    // this method recieve ether by default when someone sends it.
    // so it should a fallback function, or it should have a name of receive() with external payable modifiere and without function keyword
    receive() external payable {
        require(
            msg.value >= 0.0001 ether, // price of 1 RonaldoCoin in wei
            "RonaldoCoin's price is not met"
        );
        require(
            msg.value <= 0.0005 ether, // price of 1 RonaldoCoin in wei
            "No need to pay that much!! donate to charity instead."
        );
        require(
            balanceOf(tokenOwner) >= 0,
            "All 10 RonaldoCoin are minted. You're late."
        );
        require(
            balanceOf(msg.sender) == 0,
            "You can own at max 1 RonaldoCoin, not more. Don't be greedy"
        );

        makeTransfer(tokenOwner, msg.sender, 1 * 10**uint256(decimals()));
        // we'll send 1 coin, thich is represented by n * 10**uint256(decimals()) internally. n=1

        // send the ether earned to the token owner
        payable(tokenOwner).transfer(msg.value);
    }
}
