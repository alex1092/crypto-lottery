// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Lottery is Ownable {
    using SafeMath for uint256;

    mapping(address => uint256) public tickets;
    address[] public players;
    address[] public winners;

    uint256 public lotteryStartTime;
    uint256 public lotteryDuration;
    uint256 public constant TICKET_PRICE = 0.001 ether;
    uint256 public constant MANAGER_REWARD_PERCENTAGE = 2; // 2% of the prize pool

    constructor(
        uint256 _lotteryDuration
    ) Ownable() {
        lotteryStartTime = block.timestamp;
        lotteryDuration = _lotteryDuration;

        tickets[msg.sender] = 1;
        players.push(msg.sender);
    }

    function buyTicket(uint256 amount) public payable {
        require(amount >= TICKET_PRICE, "You must send at least 0.001 ether");
        uint256 numTickets = amount.div(TICKET_PRICE);
        tickets[msg.sender] = tickets[msg.sender].add(numTickets);
        players.push(msg.sender);
    }

    function getTotalTickets() public view returns (uint256) {
        return players.length;
    }

    function getMyTicketInfo(address player) public view returns (uint256, uint256) {
        uint256 numTickets = tickets[player];
        uint256 ticketValue = numTickets * TICKET_PRICE;
        return (numTickets, ticketValue);
    }

    function getTotalPrizePool() public view returns (uint256) {
        return getTotalTickets() * TICKET_PRICE;
    }

 function pickWinner() public {
    require(block.timestamp >= lotteryStartTime + lotteryDuration, "Lottery is still ongoing");
    require(getTotalTickets() > 0, "No tickets have been purchased yet");

    uint256 winningTicket = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, players))) % getTotalTickets();
    address winner = players[winningTicket];

    uint256 managerReward = getTotalPrizePool().mul(MANAGER_REWARD_PERCENTAGE).div(100);
    uint256 winnerReward = getTotalPrizePool().sub(managerReward);

    (bool success) = payable(winner).send(winnerReward);
    require(success, "Transfer to winner failed");

    success = payable(owner()).send(managerReward);
    require(success, "Transfer to owner failed");

    emit WinnerPicked(winner, winnerReward);

    while (players.length > 0) {
        players.pop();
    }
    players.push(msg.sender);
    winners.push(winner);

    lotteryStartTime = block.timestamp;
}

    function getWinners() public view returns (address[] memory) {
        return winners;
    }

    event WinnerPicked(address indexed winner, uint256 reward);
}