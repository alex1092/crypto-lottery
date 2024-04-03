"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";

import { prepareToBuyTicket } from "@/thirdweb/contract-connect";
import { useActiveAccount } from "thirdweb/react";
import { sendTransaction, waitForReceipt } from "thirdweb";
import { Account } from "thirdweb/wallets";
import { TransactionReceipt } from "thirdweb/transaction";

const formSchema = z.object({
  total: z.string().min(1),
});

type BuyTicketFormProps = {
  address: string;
  onReceipt: (receipt: TransactionReceipt) => void;
};

export const BuyTicketForm = ({ address, onReceipt }: BuyTicketFormProps) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      total: "0",
    },
  });

  const wallet = useActiveAccount();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const total = Number(form.watch("total")) * 0.001;

      const transaction = await prepareToBuyTicket(total.toString());
      console.log("Prepared to buy ticket");

      const transactionResult = await sendTransaction({
        account: wallet as Account,
        transaction,
      });

      const receipt = await waitForReceipt(transactionResult);
      console.log("Receipt", receipt);
      onReceipt(receipt);
    } catch (error) {
      console.error("Error buying ticket:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Input
          type="number"
          placeholder="Ticket amount"
          {...form.register("total")}
        />
        <p>Your total is {(Number(form.watch("total")) * 0.001).toFixed(3)}</p>
        <Button disabled={loading} type="submit">
          {loading ? "Buying..." : "Buy Tickets"}
        </Button>
      </form>
    </Form>
  );
};
