// SPDX-License-Identifier: MIT
pragma solidity >=0.4.17;

/*
Interface for the ERC 20 Token standard: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md.
*/

interface ERC20i {
    // events

    /// @dev MUST trigger when tokens are transferred, including zero value transfers. A token contract which creates new tokens SHOULD trigger a Transfer event with the _from address set to 0x0 when tokens are created.
    /// @param _from address of the token's current owner
    /// @param _to address of the token's future owner
    /// @param _value amount of tokens transferred
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    // methods

    
    // optional
    function name() external view returns (string memory);

    // optional
    function symbol() external view returns (string memory);

    // optional
    function decimals() external view returns (uint8);

    function totalSupply() external view returns (uint256);

    function balanceOf(address _owner) external view returns (uint256 balance);

    function transfer(address _to, uint256 _value)
        external
        returns (bool success);

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool success);

    function approve(address _spender, uint256 _value)
        external
        returns (bool success);

    function allowance(address _owner, address _spender)
        external
        view
        returns (uint256 remaining);
}
