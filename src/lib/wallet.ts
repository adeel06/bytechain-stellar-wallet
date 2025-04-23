
import { Mnemonic, HDNodeWallet, Wallet } from "ethers";

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
 * and derives the first account using BIP-32 path m/44'/60'/0'/0/0
 * 
 * @returns {GeneratedWallet} Object containing mnemonic, address and private key
 */
export function generateWallet(): GeneratedWallet {
  // Create a random 12-word mnemonic
  const mnemonic = Mnemonic.random();
  const phrase = mnemonic.phrase;
  
  // Derive the HDNode wallet using BIP-32 derivation path for Ethereum
  // m/44'/60'/0'/0/0 (purpose/coin_type/account/change/index)
  const hdNode = HDNodeWallet.fromPhrase(phrase).derivePath("m/44'/60'/0'/0/0");
  
  return {
    mnemonic: phrase,
    address: hdNode.address,
    privateKey: hdNode.privateKey,
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
    const hdNode = HDNodeWallet.fromPhrase(mnemonicPhrase).derivePath("m/44'/60'/0'/0/0");
    
    return {
      mnemonic: mnemonicPhrase,
      address: hdNode.address,
      privateKey: hdNode.privateKey,
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
