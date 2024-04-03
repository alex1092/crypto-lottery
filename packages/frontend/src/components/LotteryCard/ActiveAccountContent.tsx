"use client";

import { getTicketInfoForAddress } from "@/thirdweb/contract-connect";
import { useEffect, useState } from "react";
import { utils } from "web3";

type ActiveAccountContentProps = {
  address: string;
  totalTickets: number;
};

export const ActiveAccountContent = ({
  address,
  totalTickets,
}: ActiveAccountContentProps) => {
  const [usersTotalTickets, setUsersTotalTickets] = useState(0);
  const [usersTotalTicketValue, setUsersTotalTicketValue] = useState(0);

  useEffect(() => {
    getTicketInfoForAddress(address).then((res) => {
      setUsersTotalTickets(Number(res[0]));
      setUsersTotalTicketValue(Number(res[1]));
    });
  }, [address, totalTickets]);

  return (
    <>
      <p>Your tickets: {usersTotalTickets}</p>
      <p>Your ticket value: {utils.fromWei(usersTotalTicketValue, "ether")}</p>
    </>
  );
};
