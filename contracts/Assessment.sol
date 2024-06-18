// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;
    mapping(address => uint256) public balances;


    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event Transfer(address to,uint256 amount);

constructor(uint initBalance) payable {
    owner = payable(msg.sender);
    balance = initBalance;
    balance = initBalance;
    balances[owner] = initBalance;
}

function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }

function getBalanceOf(address _address) public view returns (uint) {
    return balances[_address];
}

    
function deposit(uint256 _amount) public payable {
        uint _previousBalance = balances[msg.sender];

        require(msg.sender == owner, "You are not the owner of this account");

        balances[msg.sender] += _amount;

        assert(balances[msg.sender] == _previousBalance + _amount);

        emit Deposit(_amount);
    }

// custom error
error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balances[msg.sender];
        if (balances[msg.sender] < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balances[msg.sender],
                withdrawAmount: _withdrawAmount
            });
        }


    balances[msg.sender] -= _withdrawAmount;

        assert(balances[msg.sender] == (_previousBalance - _withdrawAmount));

        emit Withdraw(_withdrawAmount);
    }

function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(to != address(0), "Invalid recipient address");

        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(to, amount);
    }
}

