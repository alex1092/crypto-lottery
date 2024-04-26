"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Navbar() {
  const account = useAccount();

  const pathName = usePathname();

  const isCheckWinningsRoute = pathName === "/check-winnings";

  return (
    <nav className="flex justify-end gap-5 p-4">
      {account.address ? (
        <Link href={isCheckWinningsRoute ? "/" : "/check-winnings"}>
          <Button variant={"outline"} className=" shadow-lg hover:scale-105">
            {isCheckWinningsRoute ? "Buy Tickets" : "Check Winnings"}
          </Button>
        </Link>
      ) : null}
      <ConnectButton />
    </nav>
  );
}
