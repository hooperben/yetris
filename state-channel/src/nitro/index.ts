import { NitroliteClient, NitroliteClientConfig } from "@erc7824/nitrolite";
import { createPublicClient, createWalletClient, http, Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygon } from "viem/chains";

export const CONTRACT_ADDRESSES = {
  custody: "0x4C8Bd8877C3b403BA9f9ECfaAD910AF0d8CA2c4D" as Hex,
  adjudicator: "0x5F4A4B1D293A973a1Bc0daD3BB3692Bd51058FCF" as Hex,
  tokenAddress: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" as Hex, // USDC POLYGON
  guestAddress: "0x81159bAB4b89E546C667D1159e8232D804c583DB" as Hex, // THIS IS SERVER KEY
};

export const createClient = async () => {
  const wallet = privateKeyToAccount(process.env.PRIVATE_KEY! as `0x${string}`);
  const walletClient = createWalletClient({
    transport: http(process.env.POLYGON_RPC_URL),
    chain: polygon,
    account: wallet,
  });

  const publicClient = createPublicClient({
    transport: http(process.env.POLYGON_RPC_URL!),
    chain: polygon,
  });

  // Create a dedicated client for signing state updates
  const stateWalletClient = createWalletClient({
    transport: http(process.env.POLYGON_RPC_URL),
    chain: polygon,
    account: wallet,
  });

  const config: NitroliteClientConfig = {
    publicClient,
    walletClient,
    stateWalletClient,
    addresses: CONTRACT_ADDRESSES,
    chainId: polygon.id,
    challengeDuration: BigInt(86400 * 7), // 7 days in seconds
  };

  const client = new NitroliteClient(config);

  return client;
};
