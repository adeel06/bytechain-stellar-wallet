
import { toast } from "@/components/ui/use-toast";

// Define interfaces for our API responses
export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap?: number;
  volume24h?: number;
  lastUpdated?: string;
}

// Cache mechanism to avoid excessive API calls
const priceCache: Record<string, { data: CryptoPrice; timestamp: number }> = {};
const CACHE_DURATION = 60000; // 1 minute cache

// Fetch cryptocurrency price data from CoinGecko API
export async function fetchCryptoPrice(symbol: string): Promise<CryptoPrice | null> {
  // Check cache first
  const cacheKey = symbol.toLowerCase();
  const now = Date.now();
  if (priceCache[cacheKey] && now - priceCache[cacheKey].timestamp < CACHE_DURATION) {
    return priceCache[cacheKey].data;
  }

  // Map our symbols to CoinGecko IDs
  const symbolToId: Record<string, string> = {
    'btc': 'bitcoin',
    'eth': 'ethereum',
    'byte': 'bytechain',
    'sol': 'solana',
    'ada': 'cardano'
  };

  const id = symbolToId[symbol.toLowerCase()];
  if (!id) {
    console.error(`Unknown symbol: ${symbol}`);
    return null;
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    const cryptoData: CryptoPrice = {
      symbol: symbol.toUpperCase(),
      name: data.name,
      price: data.market_data.current_price.usd,
      change24h: data.market_data.price_change_percentage_24h,
      marketCap: data.market_data.market_cap.usd,
      volume24h: data.market_data.total_volume.usd,
      lastUpdated: data.last_updated
    };

    // Store in cache
    priceCache[cacheKey] = { data: cryptoData, timestamp: now };
    
    return cryptoData;
  } catch (error) {
    console.error(`Failed to fetch ${symbol} price:`, error);
    toast({
      title: "Error fetching price data",
      description: `Could not load price data for ${symbol}. Using mock data instead.`,
      variant: "destructive",
    });
    
    // Return mock data as fallback
    return getMockCryptoPrice(symbol);
  }
}

// Fetch multiple crypto prices
export async function fetchMultipleCryptoPrices(symbols: string[]): Promise<CryptoPrice[]> {
  try {
    // Try to fetch all prices
    const promises = symbols.map(symbol => fetchCryptoPrice(symbol));
    const results = await Promise.allSettled(promises);
    
    return results
      .map((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          return result.value;
        }
        return getMockCryptoPrice(symbols[index]);
      })
      .filter(Boolean) as CryptoPrice[];
  } catch (error) {
    console.error("Failed to fetch crypto prices:", error);
    // Fallback to mock data
    return symbols.map(symbol => getMockCryptoPrice(symbol));
  }
}

// Mock data as fallback
function getMockCryptoPrice(symbol: string): CryptoPrice {
  const mockPrices: Record<string, Omit<CryptoPrice, 'symbol'>> = {
    'btc': { name: "Bitcoin", price: 48235.65, change24h: 2.34 },
    'eth': { name: "Ethereum", price: 2786.12, change24h: -0.78 },
    'byte': { name: "ByteChain", price: 12.53, change24h: 15.67 },
    'sol': { name: "Solana", price: 123.45, change24h: 4.22 },
    'ada': { name: "Cardano", price: 0.58, change24h: 1.24 }
  };

  const defaultMock = { name: symbol.toUpperCase(), price: 100.00, change24h: 0.00 };
  const mockData = mockPrices[symbol.toLowerCase()] || defaultMock;
  
  return {
    symbol: symbol.toUpperCase(),
    ...mockData
  };
}
