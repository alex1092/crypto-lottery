import { getContract, prepareContractCall, toWei } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { client } from "./client";

const contractAddress = "0xad48e299b348f1e2A92A66C26E54eb7f602f0084"
 
export const LotteryContract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: baseSepolia,
  // the contract's address
  address: contractAddress,
  // OPTIONAL: the contract's abi
  // abi: [...],
});


import { readContract } from "thirdweb";


export const getTotalTickets = async () => {
  return await readContract({
    contract: LotteryContract,
    method: "function getTotalTickets() public view returns (uint256)",
    params: [],
  });
}

export const getTotalPrizePool = async () => {
  return await readContract({
    contract: LotteryContract,
    method: "function getTotalPrizePool() public view returns (uint256)",
    params: [],
  });
}

export const getWinners = async () => {
  return await readContract({
    contract: LotteryContract,
    method: "function getWinners() public view returns (address[])",
    params: [],
  });
}

export const withdrawPrize = async (address: string) => {
  return await readContract({
    contract: LotteryContract,
    method: "function withdraw(address _to) public",
    params: [address],
  });
}

export const getTicketInfoForAddress = async (player: string) => {
  return await readContract({
    contract: LotteryContract,
    method: "function getMyTicketInfo(address player) public view returns (uint256)",
    params: [player],
  });
}

export const prepareToBuyTicket = async (total: string) => {
  return prepareContractCall({
  contract: LotteryContract,
  // Pass the method signature that you want to call
  method: "function buyTicket(uint256 amount) public payable",
  // and the params for that method
  // Their types are automatically inferred based on the method signature
  // params: [address, toWei((Number(total) * 0.001).toString())],
  params: [toWei(total)],

});
} 

