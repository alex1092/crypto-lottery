import { LotteryCard } from "@/components/lotter-card/LotteryCard";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <nav className="flex justify-end p-4">
        <ConnectButton />
      </nav>

      <main className="flex h-full justify-center items-center">
        <LotteryCard />
      </main>
    </div>
  );
}
