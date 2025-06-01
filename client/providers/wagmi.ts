"use client";

import { polygon } from "wagmi/chains";
import { http, createStorage, cookieStorage } from "wagmi";
import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";

const projectId = "b56e18d47c72ab683b10814fe9495694";
const supportedChains: Chain[] = [polygon];

export const config = getDefaultConfig({
  appName: "Yetroid",
  projectId,
  chains: supportedChains as any,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: supportedChains.reduce(
    (obj, chain) => ({ ...obj, [chain.id]: http() }),
    {},
  ),
});
