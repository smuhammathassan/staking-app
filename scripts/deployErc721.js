const hre = require("hardhat");
const { networks } = require("../hardhat.config");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");
const { parseFixed } = require("@ethersproject/bignumber");


async function main() {

    const [admin1, admin2, admin3] = await hre.ethers.getSigners();
    const erc721 = await hre.ethers.getContractFactory("RandomUnsplashImages");
    const Erc721Contract = await erc721.deploy();

    console.log("Erc721 Random Unsplash Images contract is deployed at ", Erc721Contract.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
