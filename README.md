# 🎫 OccasiOnChain - A Decentralized Event Creation System

**OccasiOnChain** is a decentralized ticketing system inspired by Ticketmaster, built using Solidity and Hardhat. This project allows event organizers to mint tickets as NFTs and sell them transparently on the blockchain. Users can purchase tickets with Ethereum, ensuring a secure and verifiable system for both buyers and sellers.

## 🚀 Features

- **Mint Tickets as NFTs**: Each event ticket is represented as an ERC721 token (NFT).
- **Event Creation**: Organizers can list events with pricing, seat capacity, and event details.

- **Security & Transparency**: Blockchain-based ticketing eliminates fraud and ensures transparent transactions.
- **Powered by Hardhat**: Uses Hardhat for contract development, testing, and deployment.

## 📝 Smart Contract Overview

The **Occasion** smart contract facilitates:

- Creation of events (occasions) with customizable parameters like name, date, location, and ticket price.
- Secure ticket purchases, with each ticket minted as an NFT on the Ethereum blockchain.

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts --network NETWORK

```
