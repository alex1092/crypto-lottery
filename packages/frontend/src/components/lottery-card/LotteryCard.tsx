"use client";

import { useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form } from "../ui/form";
import { Input } from "../ui/input";
import { lotteryContract } from "@/contracts/contractConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useForm } from "react-hook-form";
import { formatEther } from "viem";
import { type BaseError, useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { utils } from "web3";
import { z } from "zod";

const formSchema = z.object({
  total: z.string().min(1),
});

export const LotteryCard = () => {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const account = useAccount();

  const { openConnectModal } = useConnectModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      total: "0",
    },
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const {
    data: totalPrizePool,
    refetch: refetchTotalPrizePool,
    isLoading: isLoadingTotalPrizePool,
  } = useReadContract({
    ...lotteryContract,
    functionName: "getTotalPrizePool",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!account.address) {
      {
        openConnectModal && openConnectModal();
      }
      return;
    }

    const ticketPrice = Number(values.total) * 0.001;
    const priceInWei = utils.toWei(ticketPrice?.toString(), "ether");

    try {
      writeContract({
        ...lotteryContract,
        functionName: "enter",
        value: BigInt(priceInWei),
      });
    } catch (error) {
      console.log(error);
    } finally {
      refetchTotalPrizePool();
    }
  }

  useEffect(() => {
    if (isConfirmed) {
      refetchTotalPrizePool();
    }
  }, [isConfirmed, refetchTotalPrizePool]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto Lottery</CardTitle>
        <CardDescription>A fully decentralized and fair lottery game. Buy a ticket and win big prizes.</CardDescription>
      </CardHeader>
      <CardContent>
        <p> Tickets are 0.001 ETH each </p>
        {isLoadingTotalPrizePool && !totalPrizePool ? null : (
          <p>Total Prize pool: {formatEther((totalPrizePool as bigint) ?? 0)?.toString()}</p>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-4"></div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Input type="number" {...form.register("total")} />
            <Button disabled={isConfirming} className="mt-4" type="submit">
              Buy Ticket
            </Button>

            {isPending ? <div>Confirming...</div> : null}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}

            {error && <div>Error: {(error as BaseError).shortMessage || error.message}</div>}
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
};
