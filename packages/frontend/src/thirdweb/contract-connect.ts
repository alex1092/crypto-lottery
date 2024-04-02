import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { client } from "./client";
 
export const LotteryContract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: baseSepolia,
  // the contract's address
  address: "0x9D74e731d553280a3D0Cb988355f555C4eeb99Ee",
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

export const getCurrentTicketsOfAddressTotal = async () => {
  return await readContract({
    contract: LotteryContract,
    method: "function getMyTickets() public view returns (uint256)", // Update the method signature
    params: [],
  });
}
