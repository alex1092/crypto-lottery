// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Lottery is Ownable {
    using SafeMath for uint256;

    mapping(address => uint256) public tickets;
    address[] public players;
    address[] public winners;

    constructor() Ownable() {
        tickets[msg.sender] = 1;
        players.push(msg.sender);
    }

    function enter() public payable {
        uint256 numTickets = msg.value / 0.001 ether;
        require(numTickets > 0, "You must send at least 0.001 ether");

        tickets[msg.sender] += numTickets;
        players.push(msg.sender);
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players.length, getTotalTickets())));
    }

    function getTotalTickets() public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < players.length; i++) {
            total += tickets[players[i]];
        }
        return total;
    }

    function getMyTickets() public view returns (uint256) {
        return tickets[msg.sender];
    }

    function getMyTicketValue() public view returns (uint256) {
        return tickets[msg.sender] * 0.001 ether;
    }

    function getTotalPrizePool() public view returns (uint256) {
        return getTotalTickets() * 0.001 ether;
    }

    function pickWinner() public onlyOwner {
        require(getTotalTickets() > 0, "No tickets have been purchased yet");

        uint256 totalTickets = getTotalTickets();
        uint256 winningTicket = random() % totalTickets;

        uint256 currentTicket = 0;
        address winner;
        uint256 winnerReward;
        uint256 managerReward;

        for (uint256 i = 0; i < players.length; i++) {
            currentTicket = currentTicket.add(tickets[players[i]]);
            if (currentTicket > winningTicket) {
                winner = players[i];
                break;
            }
        }

        managerReward = address(this).balance / 50;
        winnerReward = address(this).balance - managerReward;

        (bool success) = payable(winner).send(winnerReward);
        require(success, "Transfer to winner failed");

        success = payable(owner()).send(managerReward);
        require(success, "Transfer to owner failed");

        emit WinnerPicked(winner, winnerReward);

        delete players;
        players.push(msg.sender);
        winners.push(winner);
    }

    function getWinners() public view returns (address[] memory) {
        return winners;
    }

    event WinnerPicked(address winner, uint256 reward);
}