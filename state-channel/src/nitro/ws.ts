import {
  createAuthRequestMessage,
  createAuthVerifyMessage,
} from "@erc7824/nitrolite";
import WebSocket from "ws";
import { walletClient } from "../constants";
import { env } from "../constants/env";

let brokerWS: WebSocket | null;

// Get broker WebSocket connection
export function getBrokerWebSocket(): WebSocket | null {
  return brokerWS;
}

export const getAuthMessage = async () => {
  const authRequestMsg = await createAuthRequestMessage({
    wallet: walletClient.account.address,
    participant: walletClient.account.address,
    app_name: env.APP_NAME,
    expire: (Math.floor(Date.now() / 1000) + 3600).toString(), // 1 hour expiration
    scope: "console",
    application: walletClient.account.address,
    allowances: [],
  });

  return authRequestMsg;
};

export const eip712MessageSigner = async (data: any) => {
  try {
    // Parse the JSON data if it's a string
    const parsed = typeof data === "string" ? JSON.parse(data) : data;

    // Extract the challenge from the proper location in the message structure
    console.log("Received data structure:", JSON.stringify(parsed, null, 2));

    // The challenge is at parsed[2][0].challenge based on the log output
    const challenge = parsed[2]?.[0]?.challenge;

    if (!challenge) {
      throw new Error("Challenge message not found in data structure");
    }

    const walletAddress = walletClient.account.address;

    const message = {
      challenge: challenge,
      scope: "console",
      wallet: walletAddress,
      application: walletAddress, // Your application address
      participant: walletAddress, // The address of the signer
      expire: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour expiration
      allowances: [],
    };

    const signature = await walletClient.signTypedData({
      account: walletClient.account!,
      domain: {
        name: env.APP_NAME,
      },
      types: {
        EIP712Domain: [{ name: "name", type: "string" }],
        Policy: [
          { name: "challenge", type: "string" },
          { name: "scope", type: "string" },
          { name: "wallet", type: "address" },
          { name: "application", type: "address" },
          { name: "participant", type: "address" },
          { name: "expire", type: "uint256" },
          { name: "allowances", type: "Allowance[]" },
        ],
        Allowance: [
          { name: "asset", type: "string" },
          { name: "amount", type: "uint256" },
        ],
      },
      primaryType: "Policy",
      message: message,
    });

    return signature;
  } catch (error) {
    console.error("Error signing message:", error);
    throw error;
  }
};

export const runNitroWS = () => {
  const ws = new WebSocket("wss://clearnet.yellow.com/ws");
  brokerWS = ws;

  ws.onopen = async () => {
    console.log("WebSocket connection established");

    // we send the ws server an auth request
    const authMessage = await getAuthMessage();
    ws.send(authMessage);
  };

  ws.onmessage = async (event) => {
    try {
      const message = JSON.parse(event?.data.toString());
      console.log("Received message:", JSON.stringify(message, undefined, 2));

      // the server responds with the auth challenge
      if (message.res && message.res[1] === "auth_challenge") {
        console.log("Received auth challenge");

        const authVerifyMsg = await createAuthVerifyMessage(
          eip712MessageSigner, // Our custom eip712 signer function
          event.data, // Raw challenge response from ClearNode
        );

        ws.send(authVerifyMsg);
        // handy for debugging
      } else if (message.res && message.res[1] === "error") {
        console.error("Received error from server:");
        console.error(
          "Full error details:",
          JSON.stringify(message.res[2], null, 2),
        );
        console.error("Error array:", message.res[2]);
      }
    } catch (err) {
      console.error("Error handling message:", err);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onclose = (event) => {
    console.log(`WebSocket closed: ${event.code} ${event.reason}`);
  };
};
