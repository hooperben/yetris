import hre, { network } from "hardhat";

async function main() {
  console.log("hello");
  const { viem } = await network.connect({
    network: "polygon",
  });

  const [Deployer] = await viem.getWalletClients();

  console.log(Deployer);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
