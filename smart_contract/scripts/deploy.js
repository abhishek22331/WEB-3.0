const { ethers } = require("hardhat");
// require("@nomiclabs/hardhat-waffle");
async function main() {
  const [deployer] = await hre.ethers.getSigners()

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("Transactions");
  const token = await Token.deploy();

  console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    // console.error(error);
    console.log(error);
    process.exit(1);
  });
