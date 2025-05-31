import "dotenv/config";

const { APP_NAME, POLYGON_RPC_URL, PRIVATE_KEY } = process.env;

if (!APP_NAME) throw new Error("Missing APP_NAME");
if (!POLYGON_RPC_URL) throw new Error("Missing POLYGON_RPC_URL");
if (!PRIVATE_KEY) throw new Error("Missing PRIVATE_KEY");

export const env = { APP_NAME, POLYGON_RPC_URL, PRIVATE_KEY };
