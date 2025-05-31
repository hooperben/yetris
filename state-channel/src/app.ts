import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import WebSocket from "ws"; // Node.js

import * as middlewares from "./middlewares";
import api from "./api";
import MessageResponse from "./interfaces/MessageResponse";
import { eip712MessageSigner, getAuthMessage } from "./nitro/ws";
import { createAuthVerifyMessage, MessageSigner } from "@erc7824/nitrolite";
import { walletClient } from "./constants";
import { ethers } from "ethers";
import { Hex } from "viem";

require("dotenv").config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

app.use("/api", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const ws = new WebSocket("wss://clearnet.yellow.com/ws");

ws.onopen = async () => {
  console.log("WebSocket connection established");
  // Connection is open, can now proceed with authentication

  const authMessage = await getAuthMessage();

  ws.send(authMessage);
};

ws.onmessage = async (event) => {
  try {
    const message = JSON.parse(event?.data.toString());
    console.log("Received message:", JSON.stringify(message, undefined, 2));

    if (message.res && message.res[1] === "auth_challenge") {
      console.log("Received auth challenge");

      // Step 3: Create and send auth_verify with signed challenge
      const authVerifyMsg = await createAuthVerifyMessage(
        eip712MessageSigner, // Our custom eip712 signer function
        event.data, // Raw challenge response from ClearNode
      );

      ws.send(authVerifyMsg);
      console.log("sent auth challenge");
    }

    // Step 4: Handle auth_success or auth_failure
    else if (message.res && message.res[1] === "auth_success") {
      console.log("Authentication successful");
      // Now you can start using the channel

      console.log("message", message.res);
    } else if (message.res && message.res[1] === "auth_failure") {
      console.error("Authentication failed:", message.res[2]);
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

export default app;
