"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { lotteryContract } from "@/contracts/contractConfig";
import { formatEther } from "viem";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export const CheckWinningsCard = () => {
  const { address: walletAddress } = useAccount();

  const router = useRouter();

  if (!walletAddress) {
    router.push("/");
  }

  const { data: hash, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const onClickHandler = () => {
    console.log("walletAddress", walletAddress);
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!walletAddress) return;
    writeContract({
      ...lotteryContract,
      functionName: "withdrawWinnings",
      args: [],
    });
  }

  // Check for winnings
  const {
    data: usersWinnings,
    isLoading,
    refetch: refetchUsersWinnings,
  } = useReadContract({
    ...lotteryContract,
    functionName: "winnings",
    args: [walletAddress],
  });

  useEffect(() => {
    if (isConfirmed) {
      refetchUsersWinnings();
    }
  }, [refetchUsersWinnings, isConfirmed]);

  const RenderWinningText = () => {
    return usersWinnings ? (
      <p>Holy Shit you won {totalWinnings}</p>
    ) : (
      <>
        <p>Better luck next time champ</p>
        <Link href={"https://careers.mcdonalds.com/"}>
          <Button className="w-full" variant={"link"}>
            McDonalds Careers
          </Button>
        </Link>
      </>
    );
  };

  const totalWinnings = isLoading ? 0 : formatEther(usersWinnings as bigint);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Winnings 🤞</CardTitle>
      </CardHeader>
      <CardContent>{isLoading ? <p>Loading...</p> : <RenderWinningText />}</CardContent>

      <CardFooter className="flex justify-center">
        {usersWinnings ? (
          <form onSubmit={submit}>
            <Button type="submit" disabled={isConfirming} onClick={onClickHandler}>
              Claim Winning
            </Button>
          </form>
        ) : null}
      </CardFooter>
    </Card>
  );
};
