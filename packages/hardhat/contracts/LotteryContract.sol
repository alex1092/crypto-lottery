// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error MinimumEntryFeeNotMet();
error CooldownPeriodNotOver();
error NoPlayersInLottery();
error NoWinningsToWithdraw();
error WithdrawFailed();
error OnlyWinningPlayerCanClaim();

contract LotteryContract is Ownable, ReentrancyGuard {
	struct Player {
		uint256 amount;
		uint256 ticketCount;
	}

	mapping(address => uint256) public winnings;
	mapping(address => Player) public players;
	address payable[] public playerAddresses;
	address payable public winningPlayer;
	uint256 public immutable MANAGER_PERCENTAGE;
	uint256 public immutable MINIMUM_ENTRY_FEE;
	uint256 public lastDrawTimestamp;
	uint256 public cooldownPeriod;

	event TicketPurchased(address indexed player, uint256 amount);
	event WinnerPicked(address indexed winner, uint256 amount);
	event WinningsClaimed(address indexed winner, uint256 amount);

	constructor() {
		MANAGER_PERCENTAGE = 5;
		MINIMUM_ENTRY_FEE = 0.001 ether;
		lastDrawTimestamp = block.timestamp;
		cooldownPeriod = 1 days;
	}

	function enter() external payable {
		if (msg.value < MINIMUM_ENTRY_FEE) revert MinimumEntryFeeNotMet();
		if (players[msg.sender].amount == 0) {
			playerAddresses.push(payable(msg.sender));
		}
		players[msg.sender].amount += msg.value;
		players[msg.sender].ticketCount += msg.value / MINIMUM_ENTRY_FEE;
		emit TicketPurchased(msg.sender, msg.value);
	}

	function getPlayerTicketCount(
		address player
	) public view returns (uint256) {
		return players[player].ticketCount;
	}

	function pickWinner() external onlyOwner {
		// Check if the cooldown period is over and if there are players in the lottery
		if (block.timestamp < lastDrawTimestamp + cooldownPeriod)
			revert CooldownPeriodNotOver();
		if (playerAddresses.length == 0) revert NoPlayersInLottery();

		// Calculate the total amount of all entries
		uint256 totalAmount = 0;
		for (uint256 i = 0; i < playerAddresses.length; i++) {
			totalAmount += players[playerAddresses[i]].amount;
		}

		// Update the last draw timestamp
		lastDrawTimestamp = block.timestamp;

		// Generate a pseudo-random number based on block attributes
		uint256 random = uint256(
			keccak256(
				abi.encodePacked(
					block.difficulty,
					block.timestamp,
					playerAddresses
				)
			)
		);

		// Use the random number to select a winner based on their proportion of the total amount
		uint256 winningTicket = random % totalAmount;
		uint256 runningTotal = 0;
		address payable winner;

		for (uint256 i = 0; i < playerAddresses.length; i++) {
			runningTotal += players[playerAddresses[i]].amount;
			if (runningTotal >= winningTicket) {
				winner = playerAddresses[i];
				break;
			}
		}

		// Calculate winnings and manager's cut
		uint256 managerCut = (totalAmount * MANAGER_PERCENTAGE) / 100;
		uint256 winningsAmount = totalAmount - managerCut;

		// Update contract state
		winnings[winner] += winningsAmount;
		payable(owner()).transfer(managerCut);
		emit WinnerPicked(winner, winningsAmount);

		// reset the lottery for the next round
		for (uint256 i = 0; i < playerAddresses.length; i++) {
			players[playerAddresses[i]].amount = 0;
			players[playerAddresses[i]].ticketCount = 0;
		}
		playerAddresses = new address payable[](0);
	}

	function getTotalPrizePool() public view returns (uint256) {
		uint256 totalPrizePool = 0;
		for (uint256 i = 0; i < playerAddresses.length; i++) {
			totalPrizePool += players[playerAddresses[i]].amount;
		}
		return totalPrizePool;
	}

	function withdrawWinnings() external nonReentrant {
		uint256 amount = winnings[msg.sender];
		if (amount == 0) revert NoWinningsToWithdraw();
		winnings[msg.sender] = 0;
		(bool success, ) = msg.sender.call{ value: amount }("");
		if (!success) revert WithdrawFailed();
		emit WinningsClaimed(msg.sender, amount);
	}

	function claimWinnings() external nonReentrant {
		require(
			msg.sender == winningPlayer,
			"Only the winning player can claim the prize"
		);
		uint256 winningAmount = players[msg.sender].amount;
		require(winningAmount > 0, "No winnings to claim");

		(bool success, ) = payable(msg.sender).call{ value: winningAmount }("");
		require(success, "Transfer failed.");
		players[msg.sender].amount = 0;
		emit WinningsClaimed(msg.sender, winningAmount);
	}

	function getPlayers() public view returns (address payable[] memory) {
		return playerAddresses;
	}
}
