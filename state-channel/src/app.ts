import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { createServer } from "http";

import * as middlewares from "./middlewares";
import api from "./api";
import MessageResponse from "./interfaces/MessageResponse";
import { runNitroWS } from "./nitro/ws";
import { runPlayerWS } from "./players/ws";

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

// this is the web socket that manages the connection to clearnet
runNitroWS();

// this is the web socket that handles player connections
const server = createServer(app);
runPlayerWS(server);

// Export the server instead of the app
export default server;
