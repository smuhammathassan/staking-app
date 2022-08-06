const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = hre.ethers;

var stakSC;
var exampleSC;

describe("Testing Staking Contract", function () {
  beforeEach(async function () {

    accounts = await hre.ethers.getSigners();
    const ExampleSC = await ethers.getContractFactory("ExampleExternalContract");
    exampleSC = await ExampleSC.deploy();
    exampleSC.deployed();
    const StakeSmartContract = await ethers.getContractFactory("Staker");
    stakSC = await StakeSmartContract.deploy(exampleSC.address);
    stakSC.deployed();

  });

  //* Testing Stake Function*//

  it("testing stake function", async function () {
    let _value = ethers.utils.parseEther("1");
    let stakeVale = await stakSC.stake({ value: _value });
    let balanceOfReturn = await stakSC.connect(accounts[0].address).balanceOf()
    expect(balanceOfReturn).to.equal(_value);
  });

  it("testing 0 as a input in stake function", async function () {
    await expect(stakSC.stake({ value: 0 })).to.be.revertedWith('Eth amount must be greater then zero!');
  });

  it("testing if we can call stake function after deadline", async function () {

    await new Promise((resolve) => setTimeout(resolve, 30000));
    expect(stakSC.stake({ value: 1 })).to.be.revertedWith('Staking period has passed!');

  });

  //* Testing Execute Function*//

  it("testing execute function", async function () {

    await stakSC.stake({ value: ethers.utils.parseEther("2") });
    await new Promise((resolve) => setTimeout(resolve, 30000));
    await stakSC.execute();
    expect(await exampleSC.completed()).to.equal(true);

  });

  it("testing execute function before deadline", async function () {

    await stakSC.stake({ value: ethers.utils.parseEther("2") });
    await expect(stakSC.execute()).to.be.revertedWith("Deadline Not Passed!");

  });

  it("testing execute function threshold thing", async function () {

    await new Promise((resolve) => setTimeout(resolve, 30000));
    await expect(stakSC.execute()).to.be.revertedWith("Threshold was not met");

  });


  it("testing execute function threshold thing", async function () {

    await new Promise((resolve) => setTimeout(resolve, 30000));
    await expect(stakSC.execute()).to.be.revertedWith("Threshold was not met");

  });

  //* Testing withdraw Function*//

  it("testing withdraw function", async function () {

    await stakSC.stake({ value: ethers.utils.parseEther("0.5") });
    await new Promise((resolve) => setTimeout(resolve, 30000));
    await stakSC.withdraw();
    expect(await stakSC.connect(accounts[0].address).balanceOf()).to.equal(0);

  });

  it("calling withdraw function before deadline ", async function () {

    await stakSC.stake({ value: ethers.utils.parseEther("0.5") });
    await expect(stakSC.withdraw()).to.be.revertedWith("Deadline Not Passed!");

  });

  it("calling withdraw function when threshold is met ", async function () {

    await stakSC.stake({ value: ethers.utils.parseEther("2") });
    await new Promise((resolve) => setTimeout(resolve, 30000));
    await expect(stakSC.withdraw()).to.be.revertedWith("Above the threshold");

  });


});
