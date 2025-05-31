import { http, createConfig } from "wagmi";
import { polygon } from "wagmi/chains";

export const config = createConfig({
  chains: [polygon],
  transports: {
    [polygon.id]: http(),
  },
});
