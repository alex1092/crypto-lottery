import { LotteryCard } from "@/components/lottery-card/LotteryCard";
import Navbar from "@/components/navbar/navbar";
import { lotteryContract } from "@/contracts/contractConfig";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <main className="flex h-full justify-center items-center">
        <LotteryCard />
      </main>

      <footer className="text-center text-gray-500">Contract: {lotteryContract?.address}</footer>
    </div>
  );
}
