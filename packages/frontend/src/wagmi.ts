import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "Create Wagmi" }),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID as string }),
  ],
  ssr: true,
  transports: {
    // [hardhat.id]: http(),

    [baseSepolia.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

// const rainbowWalletConfig = getDefaultConfig({
//   appName: "Lotter App",
//   projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID as string,
//   chains: [mainnet, baseSepolia],
//   ssr: true, // If your dApp uses server side rendering (SSR)
// });
