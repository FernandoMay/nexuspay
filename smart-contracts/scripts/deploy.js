const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Nexus Pay Smart Contracts to Hedera Testnet...");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Check account balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "HBAR");
  
  // Deploy NexusToken contracts for each currency
  const currencies = ["MXN"]; // Start with just one token for testing
  const tokenAddresses = {};
  
  console.log("\n🪙 Deploying NexusToken contracts...");
  
  for (const currency of currencies) {
    const NexusToken = await ethers.getContractFactory("NexusToken");
    console.log(`\n🔨 Deploying ${currency} token...`);
    
    const token = await NexusToken.deploy(
      `Nexus ${currency}`, // name
      `${currency}.x`,     // symbol
      currency             // currency code
    );
    
    console.log(`⏳ Waiting for deployment confirmation...`);
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    tokenAddresses[currency] = tokenAddress;
    
    console.log(`✅ ${currency}.x Token deployed at: ${tokenAddress}`);
    
    // Small delay between deployments
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Deploy NexusBridge
  console.log("\n🌉 Deploying NexusBridge...");
  const NexusBridge = await ethers.getContractFactory("NexusBridge");
  const bridge = await NexusBridge.deploy(
    Object.values(tokenAddresses), // token addresses array
    "500" // 0.5% protocol fee (in basis points)
  );
  
  await bridge.waitForDeployment();
  const bridgeAddress = await bridge.getAddress();
  console.log(`✅ NexusBridge deployed at: ${bridgeAddress}`);
  
  // Deploy NexusVault
  console.log("\n🏦 Deploying NexusVault...");
  const NexusVault = await ethers.getContractFactory("NexusVault");
  const vault = await NexusVault.deploy(
    Object.values(tokenAddresses) // token addresses array
  );
  
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log(`✅ NexusVault deployed at: ${vaultAddress}`);
  
  // Save deployment information
  const deploymentInfo = {
    network: "hedera_testnet",
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      tokens: tokenAddresses,
      bridge: bridgeAddress,
      vault: vaultAddress
    }
  };
  
  // Write deployment info to file
  const fs = require("fs");
  fs.writeFileSync(
    "./deployments/testnet.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n📋 Deployment Summary:");
  console.log("=====================================");
  console.log("Tokens:");
  Object.entries(tokenAddresses).forEach(([currency, address]) => {
    console.log(`  ${currency}.x: ${address}`);
  });
  console.log(`Bridge: ${bridgeAddress}`);
  console.log(`Vault: ${vaultAddress}`);
  console.log("=====================================");
  
  console.log("\n✨ Deployment completed successfully!");
  console.log("📁 Deployment info saved to: ./deployments/testnet.json");
  
  // Verify contracts if verification API key is available
  if (process.env.HEDERA_API_KEY) {
    console.log("\n🔍 Verifying contracts...");
    
    try {
      // Verify tokens
      for (const [currency, address] of Object.entries(tokenAddresses)) {
        await hre.run("verify:verify", {
          address: address,
          constructorArguments: [`Nexus ${currency}`, `${currency}.x`, currency]
        });
        console.log(`✅ ${currency}.x token verified`);
      }
      
      // Verify bridge
      await hre.run("verify:verify", {
        address: bridgeAddress,
        constructorArguments: [Object.values(tokenAddresses), "500"]
      });
      console.log("✅ NexusBridge verified");
      
      // Verify vault
      await hre.run("verify:verify", {
        address: vaultAddress,
        constructorArguments: [Object.values(tokenAddresses)]
      });
      console.log("✅ NexusVault verified");
      
    } catch (error) {
      console.log("⚠️  Contract verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
