// require("@nomicfoundation/hardhat-toolbox");

const { mnemonic } = require('./secrets.json');
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.13",

  networks: {
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: { mnemonic: mnemonic }
    }
  }
};
