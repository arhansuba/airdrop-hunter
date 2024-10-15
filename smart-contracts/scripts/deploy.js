const hre = require("hardhat");

async function main() {
  console.log("Deploying AirdropTracker contract...");

  // Deploy the contract
  const AirdropTracker = await hre.ethers.getContractFactory("AirdropTracker");
  const airdropTracker = await AirdropTracker.deploy();

  await airdropTracker.deployed();

  console.log("AirdropTracker deployed to:", airdropTracker.address);

  // Verify the contract on Etherscan
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await airdropTracker.deployTransaction.wait(6);
    console.log("Verifying contract on Etherscan...");
    await hre.run("verify:verify", {
      address: airdropTracker.address,
      constructorArguments: [],
    });
  }

  console.log("Deployment and verification complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });