import { getContract } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { client } from "./client";
 
// get a contract
const contract = getContract({
  // the client you have created via `createThirdwebClient()`
  client,
  // the chain the contract is deployed on
  chain: ethereum,
  // the contract's address
  address: "0x123...",
  // OPTIONAL: the contract's abi
  abi: [...],
});