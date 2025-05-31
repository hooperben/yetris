import { NitroliteClient, NitroliteClientConfig } from "@erc7824/nitrolite";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygon } from "viem/chains";
import "dotenv/config";

console.log(process.env.PRIVATE_KEY!);

const wallet = privateKeyToAccount(process.env.PRIVATE_KEY! as `0x${string}`);
export const walletClient = createWalletClient({
  transport: http(process.env.POLYGON_RPC_URL),
  chain: polygon,
  account: wallet,
});

export const publicClient = createPublicClient({
  transport: http(process.env.POLYGON_RPC_URL!),
  chain: polygon,
});

export const stateWalletClient = createWalletClient({
  transport: http(process.env.POLYGON_RPC_URL),
  chain: polygon,
  account: wallet,
});
