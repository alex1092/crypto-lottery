import { CheckWinningsCard } from "@/components/check-winnings/CheckWinningsCard";
import Navbar from "@/components/navbar/navbar";

export default function CheckWinnings() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <main className="flex h-full justify-center items-center">
        <CheckWinningsCard />
      </main>
    </div>
  );
}
