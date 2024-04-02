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
  LotteryContract,
  getCurrentTicketsOfAddressTotal,
  getTotalPrizePool,
  getTotalTickets,
} from "@/thirdweb/contract-connect";

import { useActiveAccount } from "thirdweb/react";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const LotteryCard = () => {
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalPrizePool, setTotalPrizePool] = useState("");
  const [usersTotalTickets, setUsersTotalTickets] = useState(0);
  const activeAccount = useActiveAccount();

  useEffect(() => {
    if (activeAccount) {
      getCurrentTicketsOfAddressTotal().then((res) => {
        setUsersTotalTickets(Number(res));
      });
    }
  }, [activeAccount]);

  useEffect(() => {
    const getTickets = async () => {
      const totalTickets = await getTotalTickets();
      setTotalTickets(Number(totalTickets));
    };

    const getPrizePool = async () => {
      const totalPrizePool = await getTotalPrizePool();
      setTotalPrizePool(utils.fromWei(totalPrizePool, "ether"));
    };

    getTickets();
    getPrizePool();
  }, []);

  console.log(totalTickets);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Total Tickets: {totalTickets}</p>
        <p>Total Prize: {totalPrizePool}</p>

        {activeAccount && <p>Your tickets: {usersTotalTickets}</p>}
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-4">
          <p> Tickets are 0.001 ETH each </p>
          <Input type="number" placeholder="Eth amount" />
          <Button>Buy Tickets</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LotteryCard;
