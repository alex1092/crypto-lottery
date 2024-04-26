// import deployedContracts from "../../contracts/deployedContracts";
import { LotteryContractABI } from "./contractAbi";

// export const lotteryContract = {
//   address: deployedContracts[31337].LotteryContract.address,
//   abi: deployedContracts[31337].LotteryContract.abi,
// } as const;
export const lotteryContract = {
  address: "0x066A8287fF6907edB6972A421AbE3cD53800C2AB",
  abi: LotteryContractABI,
} as const;
