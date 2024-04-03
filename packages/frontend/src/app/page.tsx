import { ConnectButton } from "@/thirdweb/thirdweb";
import { client } from "../thirdweb/client";
import LotteryCard from "@/components/LotteryCard/LotteryCard";

const Home = () => {
  return (
    <div className="flex flex-col h-screen">
      <nav className="flex bg-secondary justify-between items-center p-4">
        <h1>Logo</h1>
        <div>
          <ConnectButton theme={"dark"} client={client} />
        </div>
      </nav>

      <main className="flex h-full justify-center items-center">
        <LotteryCard />
      </main>
    </div>
  );
};

export default Home;
