import { ethers } from "hardhat";

async function main() {
  // Retrieve the contract factory for the Occasion contract
  const Occasion = await ethers.getContractFactory("Occasion");

  // Set the name and symbol for the ERC721 contract
  const name = "OccasioChain";
  const symbol = "OCC";

  // Deploy the contract with the given name and symbol
  const occasion = await Occasion.deploy(name, symbol);

  // Wait for the contract to be deployed and mined
  await occasion.deployed();

  console.log("Occasion contract deployed to:", occasion.address);
}

// Run the main function and catch any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
