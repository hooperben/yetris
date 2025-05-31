import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("YetrisTrophyModule", (m) => {
  const yetrisTrophy = m.contract("YetrisTrophy");

  return { yetrisTrophy };
});
