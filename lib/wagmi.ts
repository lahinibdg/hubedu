import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const wagmiConfig = createConfig(({
  // explicit: disable autoConnect behaviour
  autoConnect: false,
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
  // keep chains/public client simple for now (app may override later)
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  multiInjectedProviderDiscovery: true,
}) as any);
