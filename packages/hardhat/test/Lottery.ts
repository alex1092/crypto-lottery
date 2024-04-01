// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { Lottery } from "../typechain-types";
// import { Address } from "hardhat-deploy/types";

// describe("Lottery", function () {
//   let lottery: Lottery, player1: Address, player2: Address;

//   beforeEach(async function () {
//     [ player1, player2] = await ethers.getSigners();
//     lottery = await ethers.deployContract("Lottery");
//   });

//   it("should allow players to enter the lottery", async function () {
//     // Player 1 enters the lottery with 2 tickets
//     await lottery.connect(player1).enter({ value: ethers.parseEther("0.002") });
//     expect(await lottery.tickets(player1.address)).to.equal(2);
//     expect(await lottery.players(0)).to.equal(player1.address);

//     // Player 2 enters the lottery with 1 ticket
//     await lottery.connect(player2).enter({ value: ethers.parseEther("0.001") });
//     expect(await lottery.tickets(player2.address)).to.equal(1);
//     expect(await lottery.players(1)).to.equal(player2.address);
//   });

//   it("should revert if the player sends less than 0.001 ether", async function () {
//     await expect(lottery.connect(player1).enter({ value: ethers.parseEther("0.0005") })).to.be.revertedWith(
//       "You must send at least 0.001 ether",
//     );
//   });
// });
