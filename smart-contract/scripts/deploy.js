const { ethers } = require("hardhat");

async function main() {
    const stakingContract = await ethers.getContractFactory("StakingContract");
    // we deploy the contract
    const deployStakingContract = await stakingContract.deploy("0x1C6870Ea91BE123db620F59C0375Ddc5B1c9B927", 10000);
    await deployStakingContract.deployed();

    // print the address of the deployed contract
    console.log("stakingContract Address:", deployStakingContract.address);
}
// Call the main function and catch if there is any error

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });