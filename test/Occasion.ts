import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { Occasion } from "../typechain-types";
describe("Occasion Contract", () => {
  let occasion: Occasion;
  let owner: HardhatEthersSigner,
    buyer1: HardhatEthersSigner,
    buyer2: HardhatEthersSigner;
  let futureTimestamp: number;

  beforeEach(async () => {
    const Occasion = await ethers.getContractFactory("Occasion");
    [owner, buyer1, buyer2] = await ethers.getSigners();

    // Deploy the contract and wait for it to be fully deployed
    occasion = await Occasion.deploy("OccasiOnChain", "OCC");
    await occasion.getDeployedCode(); // Wait until the contract is fully deployed
    const block = await ethers.provider.getBlock("latest");
    futureTimestamp =
      (block?.timestamp ?? Math.floor(Date.now() / 1000)) + 24 * 60 * 60;
  });

  it("should set the correct owner", async () => {
    expect(await occasion.owner()).to.equal(owner.address);
  });
  it("should allow the owner to create an occasion", async () => {
    await occasion.createOccasion(
      "Web Summit", // _name
      ethers.parseEther("0.1"), // _cost
      100, // _maxTickets
      "2024-09-20", // _date
      "18:00", // _time
      "Arena XYZ", // _location (Make sure to pass a valid location string)
      futureTimestamp // _timestamp
    );

    const occasionDetails = await occasion.getOccasion(1);
    expect(occasionDetails.name).to.equal("Web Summit");
    expect(occasionDetails.maxTickets).to.equal(100);
  });
  it("should revert when non-owner tries to create an occasion", async function () {
    await expect(
      occasion.connect(buyer1).createOccasion(
        "Web Summit", // _name
        ethers.parseEther("0.1"), // _cost
        100, // _maxTickets
        "2024-09-20", // _date
        "18:00", // _time
        "Arena XYZ", // _location (Make sure to pass a valid location string)
        futureTimestamp // _timestamp
      )
    ).to.be.revertedWith("Only owner can perform this action");
  });
  it("should allow a user to mint a ticket for an occasion", async () => {
    // Owner creates an occasion
    await occasion.createOccasion(
      "Web Summit", // _name
      ethers.parseEther("0.1"), // _cost
      100, // _maxTickets
      "2024-09-20", // _date
      "18:00", // _time
      "Arena XYZ", // _location (Make sure to pass a valid location string)
      futureTimestamp // _timestamp
    );

    // buyer1 buys a ticket
    await occasion
      .connect(buyer1)
      .mintTicket(1, 1, { value: ethers.parseEther("0.1") });

    expect(await occasion.seatTaken(1, 1)).to.equal(buyer1.address);
    expect(await occasion.hasBought(1, buyer1.address)).to.be.true;
  });
  it("should fail if seat is already taken", async function () {
    await occasion.createOccasion(
      "Web Summit", // _name
      ethers.parseEther("0.1"), // _cost
      100, // _maxTickets
      "2024-09-20", // _date
      "18:00", // _time
      "Arena XYZ", // _location (Make sure to pass a valid location string)
      futureTimestamp // _timestamp
    );

    // buyer1 buys seat 1
    await occasion
      .connect(buyer1)
      .mintTicket(1, 1, { value: ethers.parseEther("0.1") });

    // user2 tries to buy the same seat
    await expect(
      occasion
        .connect(buyer2)
        .mintTicket(1, 1, { value: ethers.parseEther("0.1") })
    ).to.be.revertedWith("Seat already taken");
  });
  it("should revert if ticket payment is insufficient", async function () {
    await occasion.createOccasion(
      "Web Summit", // _name
      ethers.parseEther("0.1"), // _cost
      100, // _maxTickets
      "2024-09-20", // _date
      "18:00", // _time
      "Arena XYZ", // _location (Make sure to pass a valid location string)
      futureTimestamp // _timestamp
    );

    // buyer1 tries to buy a ticket with insufficient funds
    await expect(
      occasion
        .connect(buyer1)
        .mintTicket(1, 1, { value: ethers.parseEther("0.01") })
    ).to.be.revertedWith("Insufficient payment");
  });
  it("should allow the owner to withdraw funds", async function () {
    await occasion.createOccasion(
      "Web Summit", // _name
      ethers.parseEther("0.1"), // _cost
      100, // _maxTickets
      "2024-09-20", // _date
      "18:00", // _time
      "Arena XYZ", // _location (Make sure to pass a valid location string)
      futureTimestamp // _timestamp
    );

    // buyer1 buys a ticket
    await occasion
      .connect(buyer1)
      .mintTicket(1, 1, { value: ethers.parseEther("0.1") });

    // Check the contract balance before withdrawal
    const contractBalance = await ethers.provider.getBalance(
      await occasion.getAddress()
    );
    expect(contractBalance).to.equal(ethers.parseEther("0.1"));

    // Owner withdraws funds
    await occasion.withdraw();
    const contractBalanceAfter = await ethers.provider.getBalance(
      await occasion.getAddress()
    );
    expect(contractBalanceAfter).to.equal(0);
  });
  it("Should allow ticket purchase before the occasion date", async () => {
    // Create an occasion with a future timestamp
    await occasion.createOccasion(
      "Web Summit", // _name
      ethers.parseEther("0.1"), // _cost
      100, // _maxTickets
      "2024-09-20", // _date
      "18:00", // _time
      "Arena XYZ", // _location (Make sure to pass a valid location string)
      futureTimestamp // _timestamp
    );
  });
});
