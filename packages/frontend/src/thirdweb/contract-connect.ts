import { getContract, prepareContractCall, toWei } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { client } from "./client";

const contractAddress = "0x7B7525E6E1f0417fcE940f97bcee9969671475F1"
 
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

export const getTicketInfoForAddress = async (player: string) => {
  return await readContract({
    contract: LotteryContract,
    method: "function getMyTicketInfo(address player) public view returns (uint256, uint256)", // Update the method signature
    params: [player],
  });
}

export const prepareToBuyTicket = async (address: string, total: string) => {
  return prepareContractCall({
  contract: LotteryContract,
  // Pass the method signature that you want to call
  method: "function buyTicket(address to, uint256 amount)",
  // and the params for that method
  // Their types are automatically inferred based on the method signature
  // params: [address, toWei((Number(total) * 0.001).toString())],
  params: [address, toWei("0.001")],

});
} 

