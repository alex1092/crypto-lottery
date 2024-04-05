"use client";

import { useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form } from "../ui/form";
import { Input } from "../ui/input";
import { lotteryContract } from "@/contracts/contractConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type BaseError, useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { utils } from "web3";
import { z } from "zod";

const formSchema = z.object({
  total: z.string().min(1),
});

export const LotteryCard = () => {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      total: "0",
    },
  });

  const { address } = useAccount();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: totalTickets, refetch: refetchTotalTickets } = useReadContract({
    ...lotteryContract,
    functionName: "getTotalTickets",
    args: [],
  });

  const { data: totalPrizePool, refetch: refetchTotalPrizePool } = useReadContract({
    ...lotteryContract,
    functionName: "getTotalPrizePool",
    args: [],
  });

  const { data: myTicketInfo, refetch: refetchMyTicketInfo } = useReadContract({
    ...lotteryContract,
    functionName: "getMyTicketInfo",
    args: [address],
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values.total);
    const ticketPrice = Number(values.total) * 0.001;

    const priceInWei = utils.toWei(ticketPrice.toString(), "ether");

    writeContract({
      ...lotteryContract,
      functionName: "buyTicket",
      value: BigInt(priceInWei),
    });
  }

  useEffect(() => {
    refetchTotalTickets();
    refetchTotalPrizePool();
    refetchMyTicketInfo();
  }, [isConfirmed, refetchMyTicketInfo, refetchTotalPrizePool, refetchTotalTickets]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto Lottery</CardTitle>
        <CardDescription>A fully decentralized and fair lottery game. Buy a ticket and win big prizes.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Total Tickets Purchased: {totalTickets?.toString()}</p>
        <p>Total Prize Pool {utils.fromWei(totalPrizePool?.toString() ?? "0", "ether")} ETH</p>

        <p>My tickets {myTicketInfo?.toString() ?? 0}</p>

        <p> Tickets are 0.001 ETH each </p>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-4"></div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Input type="number" {...form.register("total")} />
            <Button disabled={isConfirming} type="submit">
              Buy Ticket
            </Button>
            {isPending ? "Confirming..." : "Send"}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}

            {error && <div>Error: {(error as BaseError).shortMessage || error.message}</div>}
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
};