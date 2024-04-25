import Link from "next/link";
import { CheckWinningsCard } from "@/components/check-winnings/CheckWinningsCard";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function CheckWinnings() {
  return (
    <div className="flex flex-col h-screen">
      <nav className="flex justify-end gap-5 p-4">
        <Link href={"/"}>
          <Button variant={"outline"} className=" shadow-lg hover:scale-105">
            Buy Tickets
          </Button>
        </Link>

        <ConnectButton />
      </nav>

      <main className="flex h-full justify-center items-center">
        <CheckWinningsCard />
      </main>
    </div>
  );
}
