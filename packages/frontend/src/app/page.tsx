import { LotteryCard } from "@/components/lotter-card/LotteryCard";
import Navbar from "@/components/navbar/navbar";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <main className="flex h-full justify-center items-center">
        <LotteryCard />
      </main>
    </div>
  );
}
