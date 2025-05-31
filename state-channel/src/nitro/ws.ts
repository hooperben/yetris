import { createAuthRequestMessage } from "@erc7824/nitrolite";
import { walletClient } from "../constants";

export const getAuthMessage = async () => {
  const authRequestMsg = await createAuthRequestMessage({
    wallet: walletClient.account.address,
    participant: walletClient.account.address,
    app_name: "http://localhost:3000/",
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
        name: "http://localhost:3000/",
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
