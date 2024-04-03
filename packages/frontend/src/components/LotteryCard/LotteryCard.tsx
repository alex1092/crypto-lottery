"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { utils } from "web3";
import {
  getTotalPrizePool,
  getTotalTickets,
} from "@/thirdweb/contract-connect";
import { useActiveAccount } from "thirdweb/react";
import { useCallback, useEffect, useState } from "react";

import { ActiveAccountContent } from "./ActiveAccountContent";
import { BuyTicketForm } from "./BuyTicketForm";
import { TransactionReceipt } from "thirdweb/transaction";

const LotteryCard = () => {
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalPrizePool, setTotalPrizePool] = useState("");
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);

  const activeAccount = useActiveAccount();

  const getTickets = useCallback(async () => {
    try {
      const totalTickets = await getTotalTickets();
      setTotalTickets(Number(totalTickets));
    } catch (error) {
      console.error("Error getting total tickets:", error);
    }
  }, []);

  const getPrizePool = useCallback(async () => {
    try {
      const totalPrizePool = await getTotalPrizePool();
      setTotalPrizePool(utils.fromWei(totalPrizePool, "ether"));
    } catch (error) {
      console.error("Error getting total prize pool:", error);
    }
  }, []);

  useEffect(() => {
    getTickets();
    getPrizePool();
  }, [getTickets, getPrizePool, receipt]);

  const handleReceipt = (receipt: TransactionReceipt) => {
    setReceipt(receipt);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Total Tickets: {totalTickets}</p>
        <p>Total Prize: {totalPrizePool}</p>

        {activeAccount && (
          <ActiveAccountContent
            totalTickets={totalTickets}
            address={activeAccount.address}
          />
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-4">
          <p> Tickets are 0.001 ETH each </p>
          {activeAccount && (
            <BuyTicketForm
              address={activeAccount.address}
              onReceipt={handleReceipt}
            />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default LotteryCard;
