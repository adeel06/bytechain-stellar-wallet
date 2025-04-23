
/**
 * Key Storage module for securely storing wallet information
 * Uses Web Crypto API with PBKDF2 (100,000 iterations) and AES-GCM
 */

/**
 * Interface for encrypted wallet data
 */
export interface EncryptedWallet {
  ciphertext: string;
  iv: string;
  salt: string;
}

// Constants for encryption
const ITERATIONS = 100000;
const HASH = "SHA-256";
const DB_NAME = "bytechain_wallet";
const STORE_NAME = "wallets";
const WALLET_KEY = "encrypted_wallet";

/**
 * Derives a cryptographic key from a password
 * 
 * @param {string} password - User's password
 * @param {Uint8Array} salt - Salt for key derivation
 * @returns {Promise<CryptoKey>} Derived key for encryption/decryption
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  // Convert password to buffer
  const passwordBuffer = new TextEncoder().encode(password);
  
  // Import the password as a key
  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  
  // Derive the actual encryption key using PBKDF2
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: HASH,
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts a wallet's private key with a password
 * 
 * @param {string} privateKey - Wallet private key to encrypt
 * @param {string} password - User's password
 * @returns {Promise<EncryptedWallet>} Encrypted wallet data
 */
export async function encryptWallet(privateKey: string, password: string): Promise<EncryptedWallet> {
  // Generate random salt and IV
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Derive key from password
  const key = await deriveKey(password, salt);
  
  // Encrypt the private key
  const privateKeyBuffer = new TextEncoder().encode(privateKey);
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    privateKeyBuffer
  );
  
  // Convert binary data to Base64 strings
  return {
    ciphertext: arrayBufferToBase64(ciphertextBuffer),
    iv: arrayBufferToBase64(iv),
    salt: arrayBufferToBase64(salt)
  };
}

/**
 * Decrypts an encrypted wallet using the password
 * 
 * @param {EncryptedWallet} encryptedWallet - Encrypted wallet data
 * @param {string} password - User's password
 * @returns {Promise<string>} Decrypted private key
 * @throws {Error} If decryption fails due to incorrect password or tampering
 */
export async function decryptWallet(encryptedWallet: EncryptedWallet, password: string): Promise<string> {
  try {
    // Convert Base64 strings back to buffers
    const iv = base64ToArrayBuffer(encryptedWallet.iv);
    const salt = base64ToArrayBuffer(encryptedWallet.salt);
    const ciphertext = base64ToArrayBuffer(encryptedWallet.ciphertext);
    
    // Derive key from password
    const key = await deriveKey(password, new Uint8Array(salt));
    
    // Decrypt the ciphertext
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      key,
      ciphertext
    );
    
    // Convert decrypted buffer to string
    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    throw new Error("Decryption failed. Incorrect password or data has been tampered with.");
  }
}

/**
 * Saves an encrypted wallet to IndexedDB
 * Falls back to localStorage if IndexedDB is not available
 * 
 * @param {EncryptedWallet} encryptedWallet - Encrypted wallet data to store
 * @returns {Promise<boolean>} True if save was successful
 */
export async function saveWallet(encryptedWallet: EncryptedWallet): Promise<boolean> {
  try {
    // Try to use IndexedDB first
    await saveWalletToIndexedDB(encryptedWallet);
    return true;
  } catch (error) {
    console.warn("IndexedDB failed, falling back to localStorage", error);
    // Fall back to localStorage
    saveWalletToLocalStorage(encryptedWallet);
    return true;
  }
}

/**
 * Loads an encrypted wallet from storage
 * Tries IndexedDB first, then falls back to localStorage
 * 
 * @returns {Promise<EncryptedWallet|null>} Encrypted wallet data or null if not found
 */
export async function loadWallet(): Promise<EncryptedWallet | null> {
  try {
    // Try to load from IndexedDB first
    const wallet = await loadWalletFromIndexedDB();
    return wallet;
  } catch (error) {
    console.warn("IndexedDB failed, falling back to localStorage", error);
    // Fall back to localStorage
    return loadWalletFromLocalStorage();
  }
}

// Helper functions for IndexedDB operations

async function saveWalletToIndexedDB(encryptedWallet: EncryptedWallet): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(new Error("IndexedDB access denied"));
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      
      const storeRequest = store.put(encryptedWallet, WALLET_KEY);
      
      storeRequest.onsuccess = () => {
        resolve();
      };
      
      storeRequest.onerror = () => {
        reject(new Error("Failed to store wallet"));
      };
    };
  });
}

async function loadWalletFromIndexedDB(): Promise<EncryptedWallet> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(new Error("IndexedDB access denied"));
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      
      const getRequest = store.get(WALLET_KEY);
      
      getRequest.onsuccess = () => {
        if (getRequest.result) {
          resolve(getRequest.result as EncryptedWallet);
        } else {
          reject(new Error("No wallet found in IndexedDB"));
        }
      };
      
      getRequest.onerror = () => {
        reject(new Error("Failed to load wallet"));
      };
    };
  });
}

// Helper functions for localStorage operations

function saveWalletToLocalStorage(encryptedWallet: EncryptedWallet): void {
  localStorage.setItem(WALLET_KEY, JSON.stringify(encryptedWallet));
}

function loadWalletFromLocalStorage(): EncryptedWallet | null {
  const data = localStorage.getItem(WALLET_KEY);
  if (!data) {
    return null;
  }
  return JSON.parse(data) as EncryptedWallet;
}

// Utility functions for Base64 conversion

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
