# hardhat-evmchain

> Zero-boilerplate multi-chain configuration for Hardhat. Powered by [evmchain-config](https://github.com/harunosakura030303-maker/evmchain-config).

[![npm version](https://badge.fury.io/js/hardhat-evmchain.svg)](https://www.npmjs.com/package/hardhat-evmchain)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## The problem

Every Hardhat project has this boilerplate:

```typescript
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  networks: {
    ethereum: { url: process.env.ETHEREUM_RPC_URL!, chainId: 1, accounts: [process.env.PRIVATE_KEY!] },
    arbitrum: { url: process.env.ARBITRUM_RPC_URL!, chainId: 42161, accounts: [process.env.PRIVATE_KEY!] },
    base: { url: process.env.BASE_RPC_URL!, chainId: 8453, accounts: [process.env.PRIVATE_KEY!] },
    optimism: { url: process.env.OPTIMISM_RPC_URL!, chainId: 10, accounts: [process.env.PRIVATE_KEY!] },
    // ... repeated 10 more times
  }
};
```

## The solution

```bash
npm install hardhat-evmchain
```

```typescript
// hardhat.config.ts
import "hardhat-evmchain";
import { loadEvmChainsSync } from "hardhat-evmchain";

const { networks } = loadEvmChainsSync();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  ...networks,
};

export default config;
```

Your `.env` drives everything:

```env
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
ARBITRUM_RPC_URL=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=0x...
```

## Supported chains

18+ EVM chains auto-detected from env var names:

| Env Var | Chain | Chain ID |
|---------|-------|----------|
| `ETHEREUM_RPC_URL` | Ethereum | 1 |
| `ARBITRUM_RPC_URL` | Arbitrum | 42161 |
| `BASE_RPC_URL` | Base | 8453 |
| `OPTIMISM_RPC_URL` | Optimism | 10 |
| `POLYGON_RPC_URL` | Polygon | 137 |
| `ZKSYNC_RPC_URL` | zkSync Era | 324 |
| `LINEA_RPC_URL` | Linea | 59144 |
| `SCROLL_RPC_URL` | Scroll | 534352 |
| `BLAST_RPC_URL` | Blast | 81457 |
| `MANTLE_RPC_URL` | Mantle | 5000 |
| `BSC_RPC_URL` | BNB Chain | 56 |
| `AVALANCHE_RPC_URL` | Avalanche | 43114 |
| + 6 more | ... | ... |

## Advanced usage (async)

```typescript
import { loadEvmChains } from "hardhat-evmchain";

// Reads foundry.toml + .env, merges both
const { networks } = await loadEvmChains();
```

## License

MIT
