const { AccountId, PrivateKey, ContractCreateFlow, ContractFunctionParameters, Client, AccountBalanceQuery } = require("@hashgraph/sdk");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying Nexus Pay Smart Contracts using Hedera SDK...");
  
  // Configure client for Hedera testnet
  const operatorId = AccountId.fromString("0.0.8353684");
  const operatorKey = PrivateKey.fromStringECDSA("0xf4bccb6e2ef884670c9864db6dabfdddafc69fd4652bddfb8d0917b7369b7655");
  
  const client = Client.forTestnet().setOperator(operatorId, operatorKey);
  
  console.log("📝 Using account:", operatorId.toString());
  
  // Check account balance
  const balanceQuery = new AccountBalanceQuery().setAccountId(operatorId);
  const balance = await balanceQuery.execute(client);
  console.log("💰 Account balance:", balance.hbars.toString(), "HBAR");
  
  // Read compiled contract artifacts
  const artifactsPath = path.join(__dirname, "../artifacts/contracts/NexusToken.sol/NexusToken.json");
  const contractArtifact = JSON.parse(fs.readFileSync(artifactsPath, "utf8"));
  
  const bytecode = contractArtifact.bytecode;
  const abi = contractArtifact.abi;
  
  console.log("📄 Contract bytecode length:", bytecode.length, "bytes");
  
  // Deploy MXN token first (simplified for testing)
  console.log("\n🪙 Deploying NexusToken (MXN)...");
  
  // Calculate gas based on bytecode size (following Hedera's gas calculation)
  const zeroBytes = (bytecode.match(/00/g) || []).length;
  const nonZeroBytes = bytecode.length - zeroBytes;
  const intrinsicGas = 21000 + (zeroBytes * 4) + (nonZeroBytes * 16);
  
  console.log("🔢 Estimated gas:", intrinsicGas);
  console.log("⛽ Zero bytes:", zeroBytes, "Non-zero bytes:", nonZeroBytes);
  
  // Create contract deployment transaction
  const contractCreateTx = new ContractCreateFlow()
    .setBytecode(bytecode)
    .setGas(300000); // Set a reasonable gas limit
  
  console.log("🔨 Submitting contract creation transaction...");
  
  try {
    // Sign and execute the transaction
    const txResponse = await contractCreateTx.execute(client);
    console.log("📬 Transaction ID:", txResponse.transactionId.toString());
    
    // Get the receipt
    const receipt = await txResponse.getReceipt(client);
    console.log("🧾 Transaction status:", receipt.status.toString());
    
    if (receipt.status.toString() === "SUCCESS") {
      const contractId = receipt.contractId;
      const contractAddress = contractId.toSolidityAddress();
      
      console.log("✅ Contract deployed successfully!");
      console.log("📍 Contract ID:", contractId.toString());
      console.log("🏠 Contract Address:", contractAddress);
      
      // Save deployment info
      const deploymentInfo = {
        network: "hedera_testnet",
        timestamp: new Date().toISOString(),
        contracts: {
          MXN: {
            contractId: contractId.toString(),
            address: contractAddress,
            transactionId: txResponse.transactionId.toString()
          }
        }
      };
      
      fs.writeFileSync(
        "./deployments/hedera-sdk-testnet.json",
        JSON.stringify(deploymentInfo, null, 2)
      );
      
      console.log("📁 Deployment info saved to: ./deployments/hedera-sdk-testnet.json");
      
    } else {
      console.error("❌ Contract deployment failed:", receipt.status.toString());
    }
    
  } catch (error) {
    console.error("❌ Deployment error:", error.message);
    if (error.transactionId) {
      console.error("📬 Transaction ID:", error.transactionId.toString());
    }
  }
  
  client.close();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
