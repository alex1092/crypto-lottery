"use client";

import { LotteryCard } from "@/components/lotter-card/LotteryCard";
import { lotteryContract } from "@/contracts/contractConfig";
import { useAccount, useConnect, useDisconnect, useReadContract } from "wagmi";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: balance } = useReadContract({
    ...lotteryContract,
    functionName: "getTotalTickets",
    args: [],
  });

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map(connector => (
          <button key={connector.uid} onClick={() => connect({ connector })} type="button">
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>

        <div>{balance?.toString()}</div>
      </div>

      <LotteryCard />
    </>
  );
}

export default App;
