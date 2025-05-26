const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const ToDo = await ethers.getContractFactory("ToDo");
    const todo = await ToDo.deploy();


    console.log("ToDo deployed to:", todo.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
