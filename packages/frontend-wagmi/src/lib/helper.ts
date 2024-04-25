import * as dn from "dnum";

export function toWei(amount: string) {
  const wei = dn.from(amount, 18);
  return wei[0];
}

export function toEther(amount: dn.Dnum) {
  const ether = dn.format(amount);
  return ether;
}
