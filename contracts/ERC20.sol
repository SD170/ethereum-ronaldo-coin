// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/*
Contract for the ERC 20 Token standard: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md.
*/

import "./ERC20i.sol";

contract ERC20 is ERC20i {
    string private tokenName;
    string private tokenSymbol;
    uint8 private tokenDecimals;
    uint256 private tokenTotalSupply;
    // address public tokenOwner;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _tokenDecimals
    ) {
        // tokenOwner = msg.sender;
        tokenName = _tokenName;
        tokenSymbol = _tokenSymbol;
        tokenTotalSupply = 0;
        tokenDecimals = 18; // convention is 18 like Wei
        if (_tokenDecimals != 0) {
            // if provided then set tokenDecimals
            tokenDecimals = _tokenDecimals;
        }
    }

    function name() public view override returns (string memory) {
        return tokenName;
    }

    function symbol() public view override returns (string memory) {
        return tokenSymbol;
    }

    function decimals() public view override returns (uint8) {
        return tokenDecimals;
    }

    function totalSupply() public view override returns (uint256) {
        return tokenTotalSupply;
    }

    function balanceOf(address _owner)
        public
        view
        override
        returns (uint256 balance)
    {
        return balances[_owner];
    }

    function transfer(address _to, uint256 _value)
        public
        override
        returns (bool success)
    {
        require(msg.sender != address(0), "zero address can't be a sender");
        makeTransfer(msg.sender, _to, _value);

        return true;
    }

    function transferFrom(
        address _from, // original owner of the token
        address _to,
        uint256 _value
    ) public override returns (bool success) {
        require(
            allowances[_from][msg.sender] >= _value,
            "not enough allowance"
        );
        allowances[_from][msg.sender] -= _value;
        balances[_to] += _value;

        makeTransfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        override
        returns (bool)
    {
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
    }

    function allowance(address _owner, address _spender)
        public
        view
        override
        returns (uint256 remaining)
    {
        return allowances[_owner][_spender];
    }

    // helper functions
    function makeTransfer(
        address _from,
        address _to,
        uint256 _value
    ) internal {
        require(
            balances[_from] >= _value,
            "sender don't have adequate resources to transfer"
        );

        balances[_from] -= _value;
        balances[_to] += _value;

        emit Transfer(_from, _to, _value);
    }

    function mintToken(address _to, uint256 _value) internal {
        // internal so can be accessed from this contract and child also
        tokenTotalSupply += _value;
        balances[_to] += _value;
        emit Transfer(address(0), _to, _value);
    }

    function burnToken(address _from, uint256 _value) internal {
        tokenTotalSupply -= _value;
        makeTransfer(_from, address(0), _value);
    }
}
