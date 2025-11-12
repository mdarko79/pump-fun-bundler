import bs58 from "bs58";
import * as fs from "fs";
import { Keypair } from "@solana/web3.js";

// Twój obecny 32-bajtowy private key w Base58
const base58PrivateKey = "5HVVmrC4m568gawW72L4fGBisPSmXqq6tKW6HbShdXUB1nibiGrCLv2RHDxkTXRWsCnHrVStESfDYM5EEVMnWjKp";

// Dekoduj
const privateKey = bs58.decode(base58PrivateKey);

// Utwórz pełny keypair (64 bajty)
const keypair = Keypair.fromSecretKey(privateKey);

// Zapisz jako JSON do pliku
fs.writeFileSync("keypair.json", JSON.stringify(Array.from(keypair.secretKey)));

console.log("Zapisano keypair.json ✔");
console.log("Base58 z 64-bajtowego secret key:");
console.log(bs58.encode(keypair.secretKey));
