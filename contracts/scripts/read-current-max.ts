import { network } from "hardhat";

async function main() {
  console.log("hello");
  const { viem } = await network.connect({
    network: "polygon",
  });

  const [Deployer] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  const trophyAddress = "0x6d64b04A8ec0dceb6304CC56845C665Fd454a0F1";

  // Example: Read the current high score
  async function getHighScore() {
    const highScore = await publicClient.readContract({
      address: trophyAddress,
      abi: [
        {
          inputs: [],
          name: "highScore",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
      ],
      functionName: "highScore",
    });
    console.log("Current high score:", highScore.toString());
    return highScore;
  }

  // Example: Get the owner of token ID 1
  async function getOwnerOf() {
    const owner = await publicClient.readContract({
      address: trophyAddress,
      abi: [
        {
          inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          name: "ownerOf",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
      ],
      functionName: "ownerOf",
      args: [1n],
    });
    console.log("Owner of token ID 1:", owner);
    return owner;
  }

  // Example: Call coronation (requires KING_MAKER role)
  async function callCoronation(newKingAddress: string, newHighScore: bigint) {
    try {
      const hash = await Deployer.writeContract({
        address: trophyAddress,
        abi: [
          {
            inputs: [
              { internalType: "address", name: "to", type: "address" },
              { internalType: "uint256", name: "newHigh", type: "uint256" },
            ],
            name: "coronation",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "coronation",
        args: [newKingAddress as `0x${string}`, newHighScore],
      });

      console.log("Coronation transaction hash:", hash);

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Coronation confirmed in block:", receipt.blockNumber);

      return hash;
    } catch (error) {
      console.error("Coronation failed:", error);
      throw error;
    }
  }

  // Example: Grant KING_MAKER role (requires DEFAULT_ADMIN_ROLE)
  async function grantKingMakerRole(addressToGrant: string) {
    try {
      // KING_MAKER role hash (keccak256("KING_MAKER"))
      const KING_MAKER_ROLE =
        "0x5503b034a2e4c0edf71c4fae38802827f462768ff30d7fa52bd722ea0883bf4e";

      const hash = await Deployer.writeContract({
        address: trophyAddress,
        abi: [
          {
            inputs: [
              { internalType: "bytes32", name: "role", type: "bytes32" },
              { internalType: "address", name: "account", type: "address" },
            ],
            name: "grantRole",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "grantRole",
        args: [
          KING_MAKER_ROLE as `0x${string}`,
          addressToGrant as `0x${string}`,
        ],
      });

      console.log("Grant role transaction hash:", hash);

      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Role granted confirmed in block:", receipt.blockNumber);

      return hash;
    } catch (error) {
      console.error("Grant role failed:", error);
      throw error;
    }
  }

  async function getKingMaker() {
    try {
      const kingMakerHash = await publicClient.readContract({
        address: trophyAddress,
        abi: [
          {
            inputs: [],
            name: "KING_MAKER",
            outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "KING_MAKER",
      });

      console.log("KING_MAKER hash from contract:", kingMakerHash);
      return kingMakerHash;
    } catch (error) {
      console.error("Failed to get KING_MAKER hash:", error);
      throw error;
    }
  }

  // Execute the examples
  // await getHighScore();

  // const kingMaker = await getKingMaker();

  // console.log(kingMaker);

  // Grant KING_MAKER role to the specified address
  // await grantKingMakerRole("0x81159bAB4b89E546C667D1159e8232D804c583DB");

  // Now test coronation with the newly granted role
  // await callCoronation("0x81159bAB4b89E546C667D1159e8232D804c583DB", 4200n);

  await getOwnerOf();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
