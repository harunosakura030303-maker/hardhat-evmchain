import { extendConfig, extendEnvironment } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { loadConfig, EvmConfig, HardhatExportConfig } from "evmchain-config";

// Augment HardhatUserConfig
declare module "hardhat/types/config" {
  interface HardhatUserConfig {
    evmchain?: {
      autoload?: boolean;
    };
  }
  interface HardhatConfig {
    evmchain: {
      autoload: boolean;
    };
  }
}

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    config.evmchain = {
      autoload: userConfig.evmchain?.autoload ?? true,
    };
  }
);

extendEnvironment((_hre) => {
  // Networks loaded at config resolution time via loadEvmChains()
});

function evmConfigToHardhat(config: EvmConfig): HardhatExportConfig {
  const networks: HardhatExportConfig["networks"] = {};
  const etherscanApiKey: Record<string, string> = {};

  config.chains.forEach((chain) => {
    const key = chain.name.toLowerCase().replace(/[\s-]+/g, "");

    // Build accounts array
    let accounts: string[] = [];
    const chainAccounts = chain.accounts ?? config.accounts ?? [];
    for (const acct of chainAccounts) {
      if (acct.type === "privateKey") {
        accounts.push(acct.key);
      }
    }
    // Fallback to PRIVATE_KEY env var
    if (accounts.length === 0 && process.env.PRIVATE_KEY) {
      accounts = [process.env.PRIVATE_KEY];
    }

    networks[key] = {
      url: chain.rpcUrl,
      chainId: chain.chainId,
      accounts: accounts.length > 0 ? accounts : undefined,
    };

    if (chain.explorerApiKey) {
      etherscanApiKey[key] = chain.explorerApiKey;
    }
  });

  return {
    networks,
    solidity: config.solidity ?? "0.8.24",
    etherscan: Object.keys(etherscanApiKey).length > 0 ? { apiKey: etherscanApiKey } : undefined,
  };
}

/**
 * Load all EVM chains from your .env / foundry.toml and return a Hardhat-compatible config.
 *
 * @example
 * // hardhat.config.ts
 * import "hardhat-evmchain";
 * import { loadEvmChains } from "hardhat-evmchain";
 *
 * export default {
 *   solidity: "0.8.24",
 *   ...await loadEvmChains(),
 * };
 */
export async function loadEvmChains(): Promise<HardhatExportConfig> {
  const config = await loadConfig();
  return evmConfigToHardhat(config);
}

/**
 * Synchronous version — reads from process.env directly.
 */
export function loadEvmChainsSync(): Pick<HardhatExportConfig, "networks"> {
  const networks: HardhatExportConfig["networks"] = {};
  const privateKey = process.env.PRIVATE_KEY;
  const accounts = privateKey ? [privateKey] : [];

  const chainMap: Array<{ name: string; chainId: number; envKey: string }> = [
    { name: "ethereum", chainId: 1, envKey: "ETHEREUM_RPC_URL" },
    { name: "goerli", chainId: 5, envKey: "GOERLI_RPC_URL" },
    { name: "sepolia", chainId: 11155111, envKey: "SEPOLIA_RPC_URL" },
    { name: "polygon", chainId: 137, envKey: "POLYGON_RPC_URL" },
    { name: "arbitrum", chainId: 42161, envKey: "ARBITRUM_RPC_URL" },
    { name: "optimism", chainId: 10, envKey: "OPTIMISM_RPC_URL" },
    { name: "base", chainId: 8453, envKey: "BASE_RPC_URL" },
    { name: "bsc", chainId: 56, envKey: "BSC_RPC_URL" },
    { name: "avalanche", chainId: 43114, envKey: "AVALANCHE_RPC_URL" },
    { name: "fantom", chainId: 250, envKey: "FANTOM_RPC_URL" },
    { name: "zksync", chainId: 324, envKey: "ZKSYNC_RPC_URL" },
    { name: "linea", chainId: 59144, envKey: "LINEA_RPC_URL" },
    { name: "scroll", chainId: 534352, envKey: "SCROLL_RPC_URL" },
    { name: "mantle", chainId: 5000, envKey: "MANTLE_RPC_URL" },
    { name: "blast", chainId: 81457, envKey: "BLAST_RPC_URL" },
    { name: "mode", chainId: 34443, envKey: "MODE_RPC_URL" },
    { name: "zora", chainId: 7777777, envKey: "ZORA_RPC_URL" },
    { name: "celo", chainId: 42220, envKey: "CELO_RPC_URL" },
  ];

  for (const { name, chainId, envKey } of chainMap) {
    const url = process.env[envKey];
    if (url) {
      networks[name] = { url, chainId, accounts };
    }
  }

  return { networks };
}
