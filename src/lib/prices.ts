
import { Contract, JsonRpcProvider } from "ethers";

const CHAINLINK_FEEDS = {
  USDT: "0x3f3f5dF88dC9F13eac63DF89EC16ef6e7E25DdE7",
  USDC: "0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3"
};

const CHAINLINK_AGGREGATOR_ABI = [
  "function latestAnswer() view returns (int256)",
  "function decimals() view returns (uint8)"
];

interface PriceData {
  [symbol: string]: {
    usd: number;
  };
}

/**
 * Fetches token prices from CoinGecko with Chainlink fallback
 */
export async function getTokenPrices(tokens: string[]): Promise<PriceData> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokens.join(",")}&vs_currencies=usd`
    );
    
    if (!response.ok) {
      throw new Error("CoinGecko API error");
    }
    
    return await response.json();
  } catch (error) {
    console.warn("Falling back to Chainlink price feeds", error);
    return getChainlinkPrices();
  }
}

async function getChainlinkPrices(): Promise<PriceData> {
  const provider = new JsonRpcProvider("https://mainnet.base.org");
  const prices: PriceData = {};
  
  await Promise.all(
    Object.entries(CHAINLINK_FEEDS).map(async ([symbol, feedAddress]) => {
      const feed = new Contract(feedAddress, CHAINLINK_AGGREGATOR_ABI, provider);
      const [price, decimals] = await Promise.all([
        feed.latestAnswer(),
        feed.decimals()
      ]);
      
      prices[symbol.toLowerCase()] = {
        usd: Number(price) / Math.pow(10, decimals)
      };
    })
  );
  
  return prices;
}
