const hre = require("hardhat");
const { networks } = require("../hardhat.config");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");


async function main() {

  const [admin1, admin2, admin3] = await hre.ethers.getSigners();

  let ExampleExternalContract = await hre.ethers.getContractFactory("ExampleExternalContract");
  ExampleExternalContract = await ExampleExternalContract.deploy();
  console.log("ExampleExternalContract is deployed at ", ExampleExternalContract.address);

  let Staking = await hre.ethers.getContractFactory("Staker");
  Staking = await Staking.deploy(ExampleExternalContract.address);
  console.log("Staking contract is deployed at ", Staking.address);
  let timeLeft = await Staking.stake({ value: ethers.utils.parseEther("1") });

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
