const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = hre.ethers;

var stakSC;
var exampleSC;

describe("Testing Erc721 Contract", function () {
    beforeEach(async function () {
        accounts = await hre.ethers.getSigners();
        const Erc721 = await ethers.getContractFactory("ExampleExternalContract");
        Erc721Contract = await Erc721.deploy();
        Erc721Contract.deployed();
    });

    //* Testing Stake Function*//

    it("testing stake function", async function () {
        let _value = ethers.utils.parseEther("1");
        let stakeVale = await stakSC.stake({ value: _value });
        let balanceOfReturn = await stakSC.connect(accounts[0].address).balanceOf()
        expect(balanceOfReturn).to.equal(_value);
    });



});
