import { AppDefinition, CreateAppSessionRequest } from "@erc7824/nitrolite";
import { Hex } from "viem";
import { walletClient } from "../constants";
import { CONTRACT_ADDRESSES } from ".";
import { getBrokerWebSocket } from "./ws";

const DEFAULT_PROTOCOL = "";
const DEFAULT_WEIGHTS = [0, 100]; // server has the power
const DEFAULT_QUORUM = 100;

export const createAppSession = (player: Hex) => {
  const participants = [player, walletClient.account.address];

  const requestId = Date.now();

  const appDefinition: AppDefinition = {
    protocol: DEFAULT_PROTOCOL,
    participants,
    weights: DEFAULT_WEIGHTS,
    quorum: DEFAULT_QUORUM,
    challenge: 0,
    nonce: Date.now(),
  };

  const params: CreateAppSessionRequest[] = [
    {
      definition: appDefinition,
      allocations: participants.map((participant) => ({
        participant,
        asset: CONTRACT_ADDRESSES.tokenAddress as Hex,
        amount: "0",
      })),
    },
  ];
  const timestamp = Math.floor(Date.now() / 1000);

  // Create the request with properly formatted parameters
  const request: { req: [number, string, CreateAppSessionRequest[], number] } =
    {
      req: [requestId, "create_app_session", params, timestamp],
    };

  const broker = getBrokerWebSocket();

  // this shouldn't happen as we authenticate with the broker on first connection
  if (!broker) throw new Error("Broker not connected");

  const result = broker?.send(JSON.stringify(request));

  console.log(result);
};
