import Link from "next/link";
import { LotteryCard } from "@/components/lotter-card/LotteryCard";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <nav className="flex justify-end gap-5 p-4">
        <Link href={"check-winnings"}>
          <Button variant={"outline"} className=" shadow-lg hover:scale-105">
            Check Winnings
          </Button>
        </Link>

        <ConnectButton />
      </nav>

      <main className="flex h-full justify-center items-center">
        <LotteryCard />
      </main>
    </div>
  );
}
