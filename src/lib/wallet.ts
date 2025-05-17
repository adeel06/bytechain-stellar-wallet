
import { Wallet, HDNodeWallet, Mnemonic } from "ethers";

/**
 * Interface representing a generated wallet
 * @property mnemonic - The 12-word BIP-39 mnemonic phrase
 * @property address - The derived Ethereum address
 * @property privateKey - The private key (should be encrypted before storage)
 */
export interface GeneratedWallet {
  mnemonic: string;
  address: string;
  privateKey: string;
}

/**
 * Generates a new wallet with a 12-word BIP-39 mnemonic phrase
 * and derives the first account using the proper derivation path
 * 
 * @returns {GeneratedWallet} Object containing mnemonic, address and private key
 */
export function generateWallet(): GeneratedWallet {
  // Create a random mnemonic (128 bits entropy = 12 words)
  const entropy = crypto.getRandomValues(new Uint8Array(16));
  const mnemonic = Mnemonic.fromEntropy(entropy);
  const phrase = mnemonic.phrase;
  
  // Create a wallet directly from the mnemonic with the standard path
  const wallet = HDNodeWallet.fromMnemonic(mnemonic);
  
  // Get the first account
  const account = wallet.derivePath("0/0");
  
  return {
    mnemonic: phrase,
    address: account.address,
    privateKey: account.privateKey,
  };
}

/**
 * Restores a wallet from a BIP-39 mnemonic phrase
 * 
 * @param {string} mnemonicPhrase - The 12-word recovery phrase
 * @returns {GeneratedWallet} Object containing mnemonic, address and private key
 * @throws {Error} If mnemonic phrase is invalid
 */
export function restoreFromMnemonic(mnemonicPhrase: string): GeneratedWallet {
  try {
    // Create a wallet directly from the mnemonic
    const wallet = HDNodeWallet.fromPhrase(mnemonicPhrase);
    
    // Get the first account
    const account = wallet.derivePath("0/0");
    
    return {
      mnemonic: mnemonicPhrase,
      address: account.address,
      privateKey: account.privateKey,
    };
  } catch (error) {
    throw new Error("Invalid mnemonic phrase");
  }
}

/**
 * Creates a wallet instance from a private key
 * 
 * @param {string} privateKey - The private key in hex format
 * @returns {Object} Object containing address and private key
 * @throws {Error} If private key is invalid
 */
export function createWalletFromPrivateKey(privateKey: string): { address: string; privateKey: string } {
  try {
    const wallet = new Wallet(privateKey);
    
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  } catch (error) {
    throw new Error("Invalid private key");
  }
}

/**
 * Encrypts a wallet's private key with a password
 * 
 * @param {string} privateKey - The private key to encrypt
 * @param {string} password - The password to encrypt with
 * @returns {Promise<string>} The encrypted wallet JSON
 */
export async function encryptWallet(privateKey: string, password: string): Promise<string> {
  try {
    const wallet = new Wallet(privateKey);
    const encrypted = await wallet.encrypt(password);
    return encrypted;
  } catch (error) {
    throw new Error("Failed to encrypt wallet");
  }
}

/**
 * Stores the encrypted wallet in local storage
 * 
 * @param {string} encryptedWallet - The encrypted wallet JSON string
 */
export async function saveWallet(encryptedWallet: string): Promise<void> {
  try {
    localStorage.setItem("wallet", encryptedWallet);
  } catch (error) {
    throw new Error("Failed to save wallet");
  }
}

/**
 * Checks if a wallet exists in storage
 * 
 * @returns {boolean} True if a wallet exists in storage
 */
export function walletExists(): boolean {
  try {
    return localStorage.getItem("wallet") !== null;
  } catch (error) {
    console.error("Error checking wallet existence:", error);
    return false;
  }
}
