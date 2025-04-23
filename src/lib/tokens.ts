
import { Contract, JsonRpcProvider, formatUnits, parseUnits } from "ethers";

const NETWORKS = {
  base: {
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    chainId: 8453,
    tokens: {
      USDT: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
      USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
    }
  }
} as const;

// Minimal ERC20 ABI
const ERC20_ABI = [
  "function transfer(address to, uint256 value) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

export interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: number;
  address: string;
}

/**
 * Handles token transfers and balance checks
 * @param tokenSymbol - The token symbol (USDT/USDC)
 * @param network - The network name
 * @param wallet - The ethers Wallet instance
 */
export async function handleTokenTransfer(
  tokenSymbol: "USDT" | "USDC",
  to: string,
  amount: string,
  network: keyof typeof NETWORKS,
  wallet: any
) {
  const networkConfig = NETWORKS[network];
  const provider = new JsonRpcProvider(networkConfig.rpcUrl);
  const tokenAddress = networkConfig.tokens[tokenSymbol];
  
  const contract = new Contract(tokenAddress, ERC20_ABI, wallet.connect(provider));
  const decimals = await contract.decimals();
  const parsedAmount = parseUnits(amount, decimals);
  
  const tx = await contract.transfer(to, parsedAmount);
  
  // Return hash immediately
  const hash = tx.hash;
  
  // Wait for confirmation with timeout
  const receipt = await Promise.race([
    tx.wait(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Transaction timeout")), 120000)
    )
  ]);
  
  return { hash, receipt };
}

/**
 * Gets token balances for an address
 */
export async function getTokenBalances(
  address: string,
  network: keyof typeof NETWORKS
): Promise<TokenBalance[]> {
  const networkConfig = NETWORKS[network];
  const provider = new JsonRpcProvider(networkConfig.rpcUrl);
  
  const balances = await Promise.all(
    Object.entries(networkConfig.tokens).map(async ([symbol, tokenAddress]) => {
      const contract = new Contract(tokenAddress, ERC20_ABI, provider);
      const [balance, decimals] = await Promise.all([
        contract.balanceOf(address),
        contract.decimals()
      ]);
      
      return {
        symbol,
        balance: formatUnits(balance, decimals),
        decimals,
        address: tokenAddress
      };
    })
  );
  
  return balances;
}
