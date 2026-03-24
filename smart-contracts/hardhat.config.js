require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.HEDERA_OPERATOR_KEY || "";
const HEDERA_ACCOUNT_ID = process.env.HEDERA_OPERATOR_ID || "";

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    hedera_testnet: {
      url: "https://testnet.hashio.io/api",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 296,
      gas: 800000,
      gasPrice: 10000000000,
      maxFeePerGas: 10000000000,
      maxPriorityFeePerGas: 1000000000,
      hedera: {
        accountId: HEDERA_ACCOUNT_ID,
        privateKey: PRIVATE_KEY
      }
    }
  },
  etherscan: {
    apiKey: {
      hedera: "your-api-key-here"
    },
    customChains: [
      {
        network: "hedera_testnet",
        chainId: 296,
        urls: {
          apiURL: "https://testnet-hashio.mirrornode.hedera.com/api/v1",
          browserURL: "https://hashscan.io/testnet"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
