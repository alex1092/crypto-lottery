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

      <main className="flex h-full flex-row justify-around items-center">
        <div>
          <h1>Home Page</h1>
          <p>Just a quick home page</p>
        </div>
        <div>
          <LotteryCard />
        </div>
      </main>
    </div>
  );
};

export default Home;
