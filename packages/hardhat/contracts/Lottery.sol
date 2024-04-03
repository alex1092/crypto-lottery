// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Lottery is Ownable {
	using SafeMath for uint256;

	mapping(address => uint256) public pendingWithdrawals;
	mapping(address => uint256) public tickets;

	mapping(address => bool) public uniquePlayers;

	address[] public players;
	uint256 private constant MAX_WINNERS_DISPLAYED = 10;
	address[] private cachedWinners;
	uint256 public totalPendingWithdrawals;
	bool public isLotteryActive = true;
	uint256 public lotteryStartTime;
	uint256 public lotteryDuration;
	uint256 public constant TICKET_PRICE = 0.001 ether;
	uint256 public constant MANAGER_REWARD_PERCENTAGE = 2;
	uint256 public totalTickets;

	constructor(uint256 _lotteryDuration) payable Ownable() {
		lotteryStartTime = block.timestamp;
		lotteryDuration = _lotteryDuration;

		// tickets[owner()] = 1;
		// players.push(owner());
		// totalTickets = 1;

		emit LotteryStarted(block.timestamp, _lotteryDuration);
	}

	function buyTicket(uint256 amount) public payable {
		require(amount >= TICKET_PRICE, "You must send at least 0.001 ether");
		uint256 numTickets = amount.div(TICKET_PRICE);
		tickets[msg.sender] = tickets[msg.sender].add(numTickets);
		if (!uniquePlayers[msg.sender]) {
			uniquePlayers[msg.sender] = true;
			players.push(msg.sender);
		}
		totalTickets = totalTickets.add(numTickets);

		emit TicketBought(msg.sender, numTickets);
	}

	function getTotalTickets() public view returns (uint256) {
		return players.length;
	}

	function getMyTicketInfo(address player) public view returns (uint256) {
		return tickets[player];
	}

	function getTotalPrizePool() public view returns (uint256) {
		return getTotalTickets() * TICKET_PRICE;
	}

	function pickWinner() public onlyOwner {
		require(
			block.timestamp >= lotteryStartTime + lotteryDuration,
			"Lottery is still ongoing"
		);
		require(getTotalTickets() > 0, "No tickets have been purchased yet");

		uint256 randomNumber = _getRandomNumber();
		uint256 winningTicket = randomNumber % getTotalTickets();
		require(
			winningTicket < players.length,
			"Winning ticket index is out of bounds"
		);
		address winner = players[winningTicket];

		uint256 totalPrizePool = getTotalPrizePool();
		uint256 managerReward = totalPrizePool
			.mul(MANAGER_REWARD_PERCENTAGE)
			.div(100);
		uint256 winnerReward = totalPrizePool.sub(managerReward);

		(bool successToWinner, ) = payable(winner).call{ value: winnerReward }(
			""
		);
		require(successToWinner, "Transfer to winner failed");

		(bool successToOwner, ) = payable(owner()).call{ value: managerReward }(
			""
		);
		require(successToOwner, "Transfer to owner failed");

		cachedWinners.push(winner);
		updateWinners();

		pendingWithdrawals[winner] = winnerReward;
		pendingWithdrawals[owner()] = managerReward;

		emit WinnerPicked(winner, winnerReward);

		resetLottery();
	}

	function _getRandomNumber() private view returns (uint256) {
		return
			uint256(
				keccak256(
					abi.encodePacked(block.timestamp, msg.sender, players)
				)
			);
	}

	function getWinners() public view returns (address[] memory) {
		return cachedWinners;
	}

	bool locked;

	modifier noReentrancy() {
		require(!locked, "No reentrancy");
		locked = true;
		_;
		locked = false;
	}

	function withdraw(address _to) public noReentrancy {
		uint256 amount = pendingWithdrawals[msg.sender];
		require(amount > 0, "No funds to withdraw");

		// Store the amount in a local variable to avoid the risk of a re-entrancy attack
		uint256 withdrawalAmount = amount;
		pendingWithdrawals[msg.sender] = 0;
		totalPendingWithdrawals -= withdrawalAmount;

		(bool success, ) = payable(_to).call{ value: withdrawalAmount }("");
		require(success, "Withdrawal failed");

		emit Withdrawn(_to, withdrawalAmount);
	}

	function resetLottery() private {
		while (players.length > 0) {
			players.pop();
		}
		updateWinners();
		lotteryStartTime = block.timestamp;

		emit LotteryReset(block.timestamp);
	}

	function updateWinners() private {
		// Clear the cachedWinners array
		while (cachedWinners.length > 0) {
			cachedWinners.pop();
		}

		// Add the top winners to the cachedWinners array
		uint256 numWinners = players.length > MAX_WINNERS_DISPLAYED
			? MAX_WINNERS_DISPLAYED
			: players.length;
		for (uint256 i = 0; i < numWinners; i++) {
			cachedWinners.push(players[i]);
		}
	}

	function startLottery() public onlyOwner {
		isLotteryActive = true;
		emit LotteryStarted(block.timestamp, lotteryDuration);
	}

	function pauseLottery() public onlyOwner {
		isLotteryActive = false;

		// Refund all the current ticket holders
		for (uint256 i = 0; i < players.length; i++) {
			address player = players[i];
			uint256 numTickets = tickets[player];
			uint256 refundAmount = numTickets * TICKET_PRICE;
			pendingWithdrawals[player] += refundAmount;
			totalPendingWithdrawals += refundAmount;
			tickets[player] = 0;
		}

		while (players.length > 0) {
			players.pop();
		}

		emit LotteryPaused(block.timestamp);
	}

	event Withdrawn(address indexed recipient, uint256 amount);
	event LotteryStarted(uint256 startTime, uint256 duration);
	event LotteryPaused(uint256 pauseTime);
	event TicketBought(address indexed buyer, uint256 numTickets);
	event LotteryReset(uint256 resetTime);
	event WinnerPicked(address indexed winner, uint256 reward);
}
