"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div>Hello {connectedAddress ?? "world"}</div>
    </>
  );
};

export default Home;
