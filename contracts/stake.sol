// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./ExampleExternalContract.sol";

contract Staker {
    ExampleExternalContract public exampleExternalContract;
    event Stake(address _from, uint256 _value);
    mapping(address => uint256) public balances;
    uint256 public constant threshold = 1 ether;
    uint256 public deadline = block.timestamp + 1 minutes;

    // modifier notCompleted() {
    //     require(
    //         exampleExternalContract.completed() == false,
    //         "can't stake after execute!"
    //     );
    //     _;
    // }

    constructor(address exampleExternalContractAddress) {
        exampleExternalContract = ExampleExternalContract(
            exampleExternalContractAddress
        );
    }

    // Collect funds in a payable `stake()` function and track individual `balances` with a mapping:
    // ( Make sure to add a `Stake(address,uint256)` event and emit it for the frontend <List/> display )
    function stake() public payable {
        /* 
        //ITS A TRAP
        it is better to use require with deadline here than adding notComplete
        modifier to stake function as it will be more gas efficient

        */
        require(deadline > block.timestamp, "Staking period has passed!");
        require(msg.value > 0, "Eth amount must be greater then zero!");
        balances[payable(msg.sender)] += msg.value;
        emit Stake(msg.sender, msg.value);
    }

    // After some `deadline` allow anyone to call an `execute()` function
    // If the deadline has passed and the threshold is met, it should call `exampleExternalContract.complete{value: address(this).balance}()`
    function execute() public payable {
        require(block.timestamp >= deadline, "Deadline Not Passed!");
        require(address(this).balance > threshold, "Threshold was not met");
        exampleExternalContract.complete{value: address(this).balance}();
    }

    // If the `threshold` was not met, allow everyone to call a `withdraw()` function
    modifier thresholdNotMet() {
        require(block.timestamp >= deadline, "Deadline Not Passed!");
        require(address(this).balance < threshold, "Above the threshold");
        _;
    }

    // Add a `withdraw()` function to let users withdraw their balance
    function withdraw() public payable thresholdNotMet {
        //Always update the balance first and send the money later. To avoid Reentrency.
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(balances[msg.sender]);
    }

    // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend

    function timeLeft() public view returns (uint256) {
        if (block.timestamp >= deadline) {
            return 0;
        } else {
            return deadline - block.timestamp;
        }
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function balanceOf() public view returns (uint256) {
        return balances[msg.sender];
    }

    // Add the `receive()` special function that receives eth and calls stake()
    receive() external payable {
        stake();
    }
}
