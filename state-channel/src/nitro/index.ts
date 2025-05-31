import { NitroliteClient, NitroliteClientConfig } from "@erc7824/nitrolite";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygon } from "viem/chains";

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
    addresses: {},
    chainId: polygon.id,
    challengeDuration: BigInt(86400), // 1 day in seconds
  };
  const client = new NitroliteClient(config);

  return client;
};
