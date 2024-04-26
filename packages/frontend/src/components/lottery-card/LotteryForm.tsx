"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { lotteryContract } from "@/contracts/contractConfig";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { BaseError } from "viem";
import { parseEther } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { z } from "zod";

const formSchema = z.object({
  total: z.string().min(1),
});

export const LotteryForm = () => {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      total: "0",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values.total);
    const ticketPrice = Number(values.total) * 0.001;

    const priceInWei = parseEther(ticketPrice.toString());

    console.log(priceInWei);

    writeContract({
      ...lotteryContract,
      functionName: "buyTicket",
      value: BigInt(priceInWei),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Input type="number" {...form.register("total")} />
        <Button disabled={isConfirming} type="submit">
          Buy Ticket
        </Button>
        <div>
          {isPending ? "Confirming..." : "Send"}
          {isConfirming && <div>Waiting for confirmation...</div>}
          {isConfirmed && <div>Transaction confirmed.</div>}
          {error && <div>Error: {(error as BaseError).shortMessage || error.message}</div>}
        </div>
      </form>
    </Form>
  );
};
