// Ultimate Pump.fun Bundler - Universal Mode (Enhanced)
import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, VersionedTransaction, Transaction, SystemProgram } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";
import promptSync from "prompt-sync";
import * as dotenv from "dotenv";
import chalk from "chalk";
import fetch from "node-fetch";
import bs58 from "bs58";
import FormData from "form-data";

dotenv.config();
const prompt = promptSync();
const connection = new Connection(process.env.RPC_URL || "https://api.mainnet-beta.solana.com", "confirmed");

const WALLET_COUNT = process.env.WALLET_COUNT ? parseInt(process.env.WALLET_COUNT) : 0;
const BUY_AMOUNT_PER_WALLET = 0.01;
const MIN_SOL_BALANCE = 0.005;
const PUMP_API_URL = "https://pumpportal.fun/api";
const JITO_API_URL = "https://mainnet.block-engine.jito.wtf/api/v1/bundles";

// Single array with related names and symbols
const TOKEN_DATA = [
    { name: "Trump's Tariff Tantrum", symbol: "TRUMPFF" }, // Trump and his tariffs on Mexico/Canada/China
    { name: "Elon's DOGE Department", symbol: "DOGEDEPT" }, // Elon and Department of Government Efficiency
    { name: "Melania's Coin Crash", symbol: "MELDOWN" }, // $MELANIA value drop
    { name: "Fartcoin Billionaire", symbol: "FARTB" }, // Fartcoin after Trump's election
    { name: "Stock Market Tariff Tears", symbol: "SMTT" }, // Stock market reaction to tariffs
    { name: "Maga Moon Rocket", symbol: "MAGAMR" }, // Trump and his "Make America Great Again" slogan
    { name: "Elon's X Empire", symbol: "XEMP" }, // Elon and his X after Twitter takeover
    { name: "Bitcoin To 100K Hype", symbol: "BTC100K" }, // Bitcoin breaking 100k after election
    { name: "Elon's AI xAI Boom", symbol: "XAIBOOM" }, // Elon's xAI and AI trend
    { name: "Trade War Dumpster Fire", symbol: "TWDF" }, // Trump's trade war
    { name: "Stopelon Protest Coin", symbol: "STOPELON" }, // Protests against Elon
    { name: "Golden Hair Trump Token", symbol: "GHAIRT" }, // Trump's iconic hairstyle
    { name: "DragonCoin", symbol: "DRGN" },
    { name: "MoonRocket", symbol: "MOON" },
    { name: "SolanaKing", symbol: "KING" },
    { name: "WenMoon", symbol: "WEN" },
    { name: "ToTheMars", symbol: "MARS" },
    { name: "BonkWarrior", symbol: "BONK" },
    { name: "PepeGold", symbol: "PEPE" },
    { name: "ShibaElon", symbol: "SHIB" },
    { name: "FlokiInu", symbol: "FLOKI" },
    { name: "LunaTerra", symbol: "LUNA" },
    { name: "ApeCoin", symbol: "APE" },
    { name: "DogelonMars", symbol: "ELON" },
    { name: "EverRise", symbol: "RISE" },
    { name: "FantomDog", symbol: "FDOG" },
    { name: "GalaxyFox", symbol: "GALAXY" },
    { name: "HippoCoin", symbol: "HIPPO" },
    { name: "InuToken", symbol: "INU" },
    { name: "Jupiter", symbol: "JUP" },
    { name: "KishuInu", symbol: "KISHU" },
    { name: "LuffyToken", symbol: "LUFFY" },
    { name: "MetaDoge", symbol: "MDOGE" },
    { name: "NinjaFloki", symbol: "NINJA" },
    { name: "OrbitCoin", symbol: "ORBIT" },
    { name: "PandaCoin", symbol: "PANDA" },
    { name: "QuantumCoin", symbol: "QUANT" },
    { name: "RocketFuel", symbol: "FUEL" },
    { name: "Saturna", symbol: "SAT" },
    { name: "TeslaInu", symbol: "TESLA" },
    { name: "Utopia", symbol: "UTO" },
    { name: "VitalikCoin", symbol: "VITAL" },
    { name: "WrappedFrog", symbol: "WFROG" },
    { name: "SafeMoon", symbol: "SAFEMOON" },
    { name: "YoloSwap", symbol: "YOLO" },
    { name: "would", symbol: "WOULD" },
    { name: "AlphaDoge", symbol: "ALPHA" },
    { name: "BetaCoin", symbol: "BETA" },
    { name: "CosmoDoge", symbol: "COSMO" },
    { name: "Fartcoin", symbol: "Fartcoin" },
    { name: "DADDY TATE", symbol: "DADDY" },
    { name: "ZetaToken", symbol: "ZETA" },
    { name: "Goatseus Maximus", symbol: "GOAT" },
    { name: "STONKS", symbol: "STONKS" },
    { name: "IotaInu", symbol: "IOTA" },
    { name: "titcoin", symbol: "titcoin" },
    { name: "FWOG", symbol: "FWOG" },
    { name: "test griffain.com", symbol: "GRIFFAIN" },
    { name: "MANSORY", symbol: "MNSRY" },
    { name: "XiDoge", symbol: "XI" },
    { name: "Omicron", symbol: "OMIC" },
    { name: "PiNetwork", symbol: "PI" },
    { name: "RhoCoin", symbol: "RHO" },
    { name: "SigmaDoge", symbol: "SIGMA" },
    { name: "TauToken", symbol: "TAU" },
    { name: "Red light therapy", symbol: "REDLIGHT" },
    { name: "Black Monday 4/7/25", symbol: "BM25" },
    { name: "hello", symbol: "hello" },
    { name: "michi", symbol: "michi" },
    { name: "China DEV", symbol: "DEV" },
    { name: "The Chill Life", symbol: "CHILL" },
    { name: "Munching Groundhog", symbol: "GNDHOG" },
    { name: "CosmicDoge", symbol: "COSMIC" },
    { name: "DigitalGold", symbol: "GOLD" },
    { name: "Ethereal", symbol: "ETHRL" },
    { name: "FrenCoin", symbol: "FREN" },
    { name: "All you need is perspective", symbol: "Perspctive" },
    { name: "Biden Would", symbol: "BIDENWOULD" },
    { name: "1st Egyptian error talks", symbol: "1STTALKS" },
    { name: "Green Monday 4/7/25", symbol: "GM25" },
    { name: "Geometric Pepe Index", symbol: "GPI" },
    { name: "LunarDoge", symbol: "LDOGE" },
    { name: "Sad & Poor Index", symbol: "S&P" },
    { name: "NeonDoge", symbol: "NEON" },
    { name: "Trump Misery Index", symbol: "TMI" },
    { name: "Pumpswap", symbol: "Pumpswap" },
    { name: "QuantumDoge", symbol: "QDOGE" },
    { name: "RocketDoge", symbol: "ROCKET" },
    { name: "StellarDoge", symbol: "SDOGE" },
    { name: "PUMPIT", symbol: "PUMPIT" },
    { name: "UltraDoge", symbol: "UDOGE" },
    { name: "Vortex", symbol: "VORTEX" },
    { name: "WonderDoge", symbol: "WDOGE" },
    { name: "XenoCoin", symbol: "XENO" },
    { name: "YieldDoge", symbol: "YDOGE" },
    { name: "ZeroGravity", symbol: "ZERO" },
    { name: "Andromeda", symbol: "ANDRO" },
    { name: "Blackhole", symbol: "BLACK" },
    { name: "CosmosDoge", symbol: "COSMOS" },
    { name: "DarkMatter", symbol: "DARK" },
    { name: "Eclipse", symbol: "ECLIPSE" },
    { name: "Greenlight Therapy", symbol: "Greenlight" },
    { name: "Hedge Coin", symbol: "hedgecoin" },
    { name: "Helix", symbol: "HELIX" },
    { name: "Sleepy Joe Market", symbol: "SJM" },
    { name: "Official Fuck Coin", symbol: "FUCK" },
    { name: "Kryptonite", symbol: "KRYPT" },
    { name: "Weenie", symbol: "Weenie" },
    { name: "MeteorDoge", symbol: "METEOR" },
    { name: "Nebula", symbol: "NEBULA" },
    { name: "OrionDoge", symbol: "ORION" },
    { name: "Pulsar", symbol: "PULSAR" },
    { name: "QuasarDoge", symbol: "QUASAR" },
    { name: "RedGiant", symbol: "RED" },
    { name: "Supernova", symbol: "SUPER" },
    { name: "Browser Agent", symbol: "BROWSER" },
    { name: "Lost my life savings", symbol: "REKT" },
    { name: "CrashCoin", symbol: "CrashCoin" },
    { name: "Freaky Ahh Villager", symbol: "Freaky" },
    { name: "Act I : The AI Prophecy", symbol: "AI" },
    { name: "SIGMA", symbol: "SIGMA" },
    { name: "PatriotCoin", symbol: "PATRIOT" },
    { name: "TrumpKing", symbol: "TKING" },
    { name: "TARIFF MAN TRUMP", symbol: "TARIFF" },
    { name: "jelly-my-jelly", symbol: "jellyjelly" },
    { name: "KIKICat", symbol: "KIKI" },
    { name: "WOMAN YELLING AT CAT", symbol: "WYAC" },
    { name: "Shark Cat", symbol: "SharkCat" },
    { name: "Poorification", symbol: "POOR" },
    { name: "If not now, when?", symbol: "When" },
    { name: "Homelesscoin", symbol: "homeless" },
    { name: "MagaDoge", symbol: "MDOGE" },
    { name: "Dill Bits", symbol: "DillBits" },
    { name: "Kekius Maximus", symbol: "KM" },
    { name: "SEED OF PEPE", symbol: "S33D" },
    { name: "BUY THE FEAR", symbol: "FEAR COIN" },
    { name: "Good Old Times Gone", symbol: "GOTG" },
    { name: "NEW TARIFF MEME", symbol: "TARIFF" },
    { name: "Buckazoids", symbol: "Buckazoids" },
    { name: "FAT NIGGA SEASON", symbol: "FAT" },
    { name: "Retard Finder Coin", symbol: "RFC" },
    { name: "BitMeme", symbol: "BitMeme" }
];

let totalProfit = 0;
let tokensCreated = 0;
let successfulSales = 0;
let lastCreatedMint: string = "";

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function logAction(action: string, message: string): void {
    const timestamp = new Date().toISOString();
    console.log(chalk.gray(`[${timestamp}] ${action}: ${message}`));
}

async function getTokenPrice(mint: PublicKey): Promise<number> {
    try {
        const response = await fetch(`https://frontend-api.pump.fun/coins/${mint.toBase58()}`);
        if (!response.ok) return 0;
        const data: any = await response.json();
        return data.usd_market_cap || 0;
    } catch (e) {
        return 0;
    }
}

async function generateKeypairs(count: number, connection: Connection): Promise<void> {
    console.log(chalk.cyan(`\nGenerating ${count} wallets...`));
    const lightningWallet = Keypair.fromSecretKey(bs58.decode(process.env.LIGHTNING_SECRET_KEY!));
    const wallets: { publicKey: string; privateKey: string }[] = [];

    for (let i = 0; i < count; i++) {
        const kp = Keypair.generate();
        wallets.push({ publicKey: kp.publicKey.toBase58(), privateKey: bs58.encode(kp.secretKey) });
        console.log(chalk.green(`✓ Wallet ${i + 1}/${count}: ${kp.publicKey.toBase58()}`));
    }

    fs.writeFileSync("wallets.json", JSON.stringify(wallets, null, 2));
    console.log(chalk.green(`\n✓ Saved ${count} wallets to wallets.json`));

    console.log(chalk.yellow(`\nFunding wallets with ${(BUY_AMOUNT_PER_WALLET + 0.002).toFixed(4)} SOL each...`));
    const lightningBalance = await connection.getBalance(lightningWallet.publicKey);
    const requiredBalance = (BUY_AMOUNT_PER_WALLET + 0.002) * count * LAMPORTS_PER_SOL;

    if (lightningBalance < requiredBalance) {
        console.log(chalk.red(`Insufficient balance! Required: ${requiredBalance / LAMPORTS_PER_SOL} SOL, Available: ${lightningBalance / LAMPORTS_PER_SOL} SOL`));
        return;
    }

    const tx = new Transaction();
    for (const w of wallets) {
        const pubkey = new PublicKey(w.publicKey);
        tx.add(
            SystemProgram.transfer({
                fromPubkey: lightningWallet.publicKey,
                toPubkey: pubkey,
                lamports: (BUY_AMOUNT_PER_WALLET + 0.002) * LAMPORTS_PER_SOL
            })
        );
    }

    const sig = await connection.sendTransaction(tx, [lightningWallet]);
    await connection.confirmTransaction(sig, "confirmed");
    console.log(chalk.green(`\n✓ Funded all wallets. Signature: ${sig}`));
}

interface BuyResult {
    signature?: string;
    error?: string;
}

async function buyWithRetry(walletKeypair: Keypair, mint: PublicKey, amount: number, retries: number = 3): Promise<BuyResult> {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(`${PUMP_API_URL}/trade-local`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.PUMP_PORTAL_API_KEY}`
                },
                body: JSON.stringify({
                    publicKey: walletKeypair.publicKey.toBase58(),
                    action: "buy",
                    mint: mint.toBase58(),
                    denominatedInSol: "true",
                    amount: amount,
                    slippage: 10,
                    priorityFee: 0.005,
                    pool: "pump"
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.log(chalk.red(`API error on attempt ${i + 1}: ${response.status} - ${errorText}`));
                if (i < retries - 1) {
                    await sleep(2000);
                    continue;
                }
                return { error: `${response.status} - ${errorText}` };
            }

            const data = await response.arrayBuffer();
            const tx = VersionedTransaction.deserialize(new Uint8Array(data));
            tx.sign([walletKeypair]);

            const sig = await connection.sendTransaction(tx);
            await connection.confirmTransaction(sig, "confirmed");
            console.log(chalk.green(`✓ Purchase successful: ${sig}`));
            return { signature: sig };
        } catch (e: any) {
            console.log(chalk.red(`Attempt ${i + 1} failed: ${e.message}`));
            if (i < retries - 1) await sleep(2000);
        }
    }
    return { error: "All attempts failed" };
}

class PumpFunUniversalBundler {
    private connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async createToken(): Promise<PublicKey> {
        console.log(chalk.bold.cyan("\n=== TOKEN CREATION ==="));
        const lightningWallet = Keypair.fromSecretKey(bs58.decode(process.env.LIGHTNING_SECRET_KEY!));
        
        // Select random token data
        const randomIndex = Math.floor(Math.random() * TOKEN_DATA.length);
        const selectedToken = TOKEN_DATA[randomIndex];
        
        console.log(chalk.yellow(`\nSelected token: ${selectedToken.name} (${selectedToken.symbol})`));

        const tokenName = selectedToken.name;
        const tokenSymbol = selectedToken.symbol;
        const tokenDescription = `Meme token - ${selectedToken.name}`;

        const form = new FormData();
        form.append("file", Buffer.from([]), { filename: "default.png", contentType: "image/png" });
        form.append("name", tokenName);
        form.append("symbol", tokenSymbol);
        form.append("description", tokenDescription);
        form.append("twitter", "");
        form.append("telegram", "");
        form.append("website", "");
        form.append("showName", "true");

        console.log(chalk.cyan("Uploading metadata to IPFS..."));
        const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
            method: "POST",
            body: form
        });

        if (!metadataResponse.ok) {
            throw new Error(`IPFS upload failed: ${await metadataResponse.text()}`);
        }

        const { metadataUri } = await metadataResponse.json();
        console.log(chalk.green(`✓ Metadata URI: ${metadataUri}`));

        console.log(chalk.cyan("\nCreating token..."));
        const createResponse = await fetch(`${PUMP_API_URL}/trade-local`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.PUMP_PORTAL_API_KEY}`
            },
            body: JSON.stringify({
                publicKey: lightningWallet.publicKey.toBase58(),
                action: "create",
                tokenMetadata: {
                    name: tokenName,
                    symbol: tokenSymbol,
                    uri: metadataUri
                },
                mint: Keypair.generate().publicKey.toBase58(),
                denominatedInSol: "true",
                amount: 0,
                slippage: 10,
                priorityFee: 0.005,
                pool: "pump"
            })
        });

        if (!createResponse.ok) {
            throw new Error(`Token creation failed: ${await createResponse.text()}`);
        }

        const createData = await createResponse.arrayBuffer();
        const createTx = VersionedTransaction.deserialize(new Uint8Array(createData));
        createTx.sign([lightningWallet]);

        const createSig = await connection.sendTransaction(createTx);
        await connection.confirmTransaction(createSig, "confirmed");
        console.log(chalk.green(`✓ Token created! Signature: ${createSig}`));

        const txDetails = await connection.getTransaction(createSig, { maxSupportedTransactionVersion: 0 });
        let mint: PublicKey | null = null;

        if (txDetails?.meta?.postTokenBalances) {
            for (const balance of txDetails.meta.postTokenBalances) {
                if (balance.mint) {
                    mint = new PublicKey(balance.mint);
                    break;
                }
            }
        }

        if (!mint) {
            throw new Error("Failed to extract mint address from transaction");
        }

        console.log(chalk.bold.green(`✓ Mint: ${mint.toBase58()}`));
        lastCreatedMint = mint.toBase58();
        tokensCreated++;

        if (WALLET_COUNT > 0) {
            console.log(chalk.cyan(`\nInitiating purchases from ${WALLET_COUNT} wallets...`));
            const walletsData = JSON.parse(fs.readFileSync("wallets.json", "utf8"));
            
            for (let i = 0; i < walletsData.length; i++) {
                const kp = Keypair.fromSecretKey(bs58.decode(walletsData[i].privateKey));
                console.log(chalk.yellow(`\nWallet ${i + 1}/${walletsData.length}: ${kp.publicKey.toBase58()}`));
                
                const balance = await connection.getBalance(kp.publicKey);
                if (balance < MIN_SOL_BALANCE * LAMPORTS_PER_SOL) {
                    console.log(chalk.red(`Insufficient balance: ${balance / LAMPORTS_PER_SOL} SOL`));
                    continue;
                }

                const result = await buyWithRetry(kp, mint, BUY_AMOUNT_PER_WALLET);
                if (result.error) {
                    console.log(chalk.red(`✗ Purchase failed: ${result.error}`));
                } else {
                    console.log(chalk.green(`✓ Purchased ${BUY_AMOUNT_PER_WALLET} SOL worth`));
                }
                await sleep(1000);
            }
        } else {
            console.log(chalk.cyan("\nInitiating purchase from main wallet..."));
            const result = await buyWithRetry(lightningWallet, mint, BUY_AMOUNT_PER_WALLET);
            if (result.error) {
                console.log(chalk.red(`✗ Purchase failed: ${result.error}`));
            }
        }

        return mint;
    }

    async sellTokens(): Promise<void> {
        console.log(chalk.bold.cyan("\n=== SELLING TOKENS ==="));
        
        if (!lastCreatedMint) {
            console.log(chalk.red("No token created yet - use option 2 first!"));
            return;
        }

        const mint = new PublicKey(lastCreatedMint);

        if (WALLET_COUNT > 0) {
            const walletsData = JSON.parse(fs.readFileSync("wallets.json", "utf8"));
            let totalSold = 0;

            for (let i = 0; i < walletsData.length; i++) {
                const kp = Keypair.fromSecretKey(bs58.decode(walletsData[i].privateKey));
                console.log(chalk.yellow(`\nWallet ${i + 1}/${walletsData.length}: ${kp.publicKey.toBase58()}`));

                try {
                    const tokenAccounts = await connection.getTokenAccountsByOwner(kp.publicKey, { mint });
                    if (tokenAccounts.value.length === 0) {
                        console.log(chalk.gray("No tokens to sell"));
                        continue;
                    }

                    const sellResponse = await fetch(`${PUMP_API_URL}/trade-local`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${process.env.PUMP_PORTAL_API_KEY}`
                        },
                        body: JSON.stringify({
                            publicKey: kp.publicKey.toBase58(),
                            action: "sell",
                            mint: mint.toBase58(),
                            denominatedInSol: "false",
                            amount: 100,
                            slippage: 10,
                            priorityFee: 0.005,
                            pool: "pump"
                        })
                    });

                    if (!sellResponse.ok) {
                        console.log(chalk.red(`Sale failed: ${await sellResponse.text()}`));
                        continue;
                    }

                    const sellData = await sellResponse.arrayBuffer();
                    const sellTx = VersionedTransaction.deserialize(new Uint8Array(sellData));
                    sellTx.sign([kp]);

                    const sellSig = await connection.sendTransaction(sellTx);
                    await connection.confirmTransaction(sellSig, "confirmed");
                    console.log(chalk.green(`✓ Sale successful: ${sellSig}`));
                    totalSold++;
                    successfulSales++;
                } catch (e: any) {
                    console.log(chalk.red(`Error: ${e.message}`));
                }

                await sleep(1000);
            }

            console.log(chalk.bold.green(`\n✓ Total sales: ${totalSold}/${walletsData.length}`));
        } else {
            const lightningWallet = Keypair.fromSecretKey(bs58.decode(process.env.LIGHTNING_SECRET_KEY!));
            console.log(chalk.yellow("Selling from main wallet..."));

            try {
                const tokenAccounts = await connection.getTokenAccountsByOwner(lightningWallet.publicKey, { mint });
                if (tokenAccounts.value.length === 0) {
                    console.log(chalk.red("No tokens to sell"));
                    return;
                }

                const sellResponse = await fetch(`${PUMP_API_URL}/trade-local`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${process.env.PUMP_PORTAL_API_KEY}`
                    },
                    body: JSON.stringify({
                        publicKey: lightningWallet.publicKey.toBase58(),
                        action: "sell",
                        mint: mint.toBase58(),
                        denominatedInSol: "false",
                        amount: 100,
                        slippage: 10,
                        priorityFee: 0.005,
                        pool: "pump"
                    })
                });

                if (!sellResponse.ok) {
                    console.log(chalk.red(`Sale failed: ${await sellResponse.text()}`));
                    return;
                }

                const sellData = await sellResponse.arrayBuffer();
                const sellTx = VersionedTransaction.deserialize(new Uint8Array(sellData));
                sellTx.sign([lightningWallet]);

                const sellSig = await connection.sendTransaction(sellTx);
                await connection.confirmTransaction(sellSig, "confirmed");
                console.log(chalk.green(`✓ Sale successful: ${sellSig}`));
                successfulSales++;
            } catch (e: any) {
                console.log(chalk.red(`Error: ${e.message}`));
            }
        }
    }

    async showStats(): Promise<void> {
        console.log(chalk.bold.cyan("\n=== STATISTICS ==="));
        console.log(chalk.white(`Tokens created: ${tokensCreated}`));
        console.log(chalk.white(`Successful sales: ${successfulSales}`));
        console.log(chalk.white(`Total profit: ${totalProfit.toFixed(4)} SOL`));
        
        if (lastCreatedMint) {
            console.log(chalk.white(`Last created token: ${lastCreatedMint}`));
            const price = await getTokenPrice(new PublicKey(lastCreatedMint));
            console.log(chalk.white(`Current price: ${price} SOL`));
        }
    }

    async autoMode(threshold: number = 1.5): Promise<void> {
        console.log(chalk.bold.magenta(`\n=== AUTOMATIC MODE (profit threshold: ${threshold}x) ===`));
        console.log(chalk.yellow("Bot will create token, monitor price, and sell automatically"));
        
        while (true) {
            try {
                const mint = await this.createToken();
                const initialPrice = await getTokenPrice(mint);
                console.log(chalk.blue(`Initial price: ${initialPrice} SOL`));
                console.log(chalk.yellow(`Monitoring price... (target: ${(initialPrice * threshold).toFixed(6)} SOL)`));
                await this.monitorTokenPrice(mint, initialPrice, threshold);
                await this.sellTokens();
                await sleep(60000);
            } catch (e) {
                console.log(chalk.red(`Error in automatic mode: ${e}`));
                await sleep(30000);
            }
        }
    }

    private async monitorTokenPrice(mint: PublicKey, initialPrice: number, threshold: number): Promise<void> {
        const timeout = 10 * 60 * 1000;
        const interval = 5000;
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const currentPrice = await getTokenPrice(mint);
            console.log(chalk.gray(`Price: ${currentPrice} SOL (target: ${(initialPrice * threshold).toFixed(6)})`));
            if (currentPrice >= initialPrice * threshold) {
                console.log(chalk.green(`✓ Threshold reached: ${currentPrice} SOL`));
                return;
            }
            await sleep(interval);
        }
        console.log(chalk.yellow("⏰ Timeout - threshold not reached"));
    }

    private async quickSnipeWatch(mint: PublicKey, basePrice: number, snipeMultiplier: number): Promise<boolean> {
        const deadline = Date.now() + 30000;
        const interval = 200;
        while (Date.now() < deadline) {
            const price = await getTokenPrice(mint);
            console.log(chalk.gray(`[SNIPE] Price: ${price} SOL | Target: ${(basePrice * snipeMultiplier).toFixed(6)} SOL`));
            if (price >= basePrice * snipeMultiplier) {
                console.log(chalk.green(`[SNIPE] 🚀 Spike! Price reached threshold: ${price} SOL`));
                return true;
            }
            await sleep(interval);
        }
        console.log(chalk.yellow("[SNIPE] ⏰ Timeout - no spike detected"));
        return false;
    }

    async autoSnipeMode(snipeThreshold: number = 1.3): Promise<void> {
        if (!lastCreatedMint) {
            console.log(chalk.red("No token created yet - use option 2 first!"));
            return;
        }

        const mint = new PublicKey(lastCreatedMint);
        console.log(chalk.bold.magenta(`\n=== AUTO-SNIPE MODE (threshold: ${snipeThreshold}x in 30s for ${mint.toBase58()}) ===`));
        try {
            const base = await getTokenPrice(mint);
            console.log(chalk.cyan(`Initial price: ${base} SOL`));
            const spiked = await this.quickSnipeWatch(mint, base, snipeThreshold);
            if (spiked) {
                await this.sellTokens();
            } else {
                console.log(chalk.yellow("❌ Spike not detected."));
            }
        } catch (e) {
            console.log(chalk.red("Error in auto-snipe mode:"), e);
        }
    }
}

async function main() {
    console.log(chalk.bold.cyan("\n=== Ultimate Pump.fun Bundler ==="));
    console.log(chalk.blue(`Mode: ${WALLET_COUNT === 0 ? "SINGLE-WALLET" : "MULTI-WALLET (" + WALLET_COUNT + " wallets)"}`));

    const bundler = new PumpFunUniversalBundler(connection);
    
    while (true) {
        console.log(chalk.bold("\nMAIN MENU"));
        console.log("1. Generate wallets (multi-wallet only)");
        console.log("2. Create token");
        console.log("3. Sell tokens");
        console.log("4. Show statistics");
        console.log("5. Automatic mode");
        console.log("6. Exit");
        console.log("7. Auto-snipe mode (sell on quick price spike)");
        console.log("8. Create token + auto-snipe (60s monitoring)");

        const choice = prompt("Select option: ");

        switch (choice) {
            case "1":
                if (WALLET_COUNT === 0) {
                    console.log(chalk.yellow("Wallet generation available only in multi-wallet mode (WALLET_COUNT > 0)"));
                } else {
                    await generateKeypairs(WALLET_COUNT, connection);
                }
                break;

            case "2":
                try {
                    await bundler.createToken();
                    console.log(chalk.green("\nOperation completed successfully!"));
                } catch (e) {
                    console.log(chalk.red(`\nERROR: ${e}`));
                }
                break;

            case "3":
                try {
                    await bundler.sellTokens();
                    console.log(chalk.green("\nOperation completed!"));
                } catch (e) {
                    console.log(chalk.red(`\nERROR: ${e}`));
                }
                break;

            case "4":
                await bundler.showStats();
                break;

            case "5":
                const thresholdStr = prompt("Enter profit threshold (e.g. 1.5): ") || "1.5";
                const threshold = parseFloat(thresholdStr);
                if (isNaN(threshold) || threshold <= 1) {
                    console.log(chalk.red("Threshold must be greater than 1"));
                    break;
                }
                await bundler.autoMode(threshold);
                break;

            case "6":
                console.log(chalk.yellow("\nClosing bundler..."));
                process.exit(0);

            case "7":
                const snipeStr = prompt("Spike threshold (e.g. 1.3): ") || "1.3";
                const snipeThreshold = parseFloat(snipeStr);
                if (isNaN(snipeThreshold) || snipeThreshold <= 1) {
                    console.log(chalk.red("Threshold must be greater than 1"));
                    break;
                }
                await bundler.autoSnipeMode(snipeThreshold);
                break;

            case "8":
                try {
                    const mint = await bundler.createToken();
                    const initialPrice = await getTokenPrice(mint);
                    console.log(chalk.blue(`Initial price: ${initialPrice} SOL`));

                    const targetMultiplier = 1.2;
                    const interval = 200;
                    const timeout = 60_000;
                    console.log(chalk.yellow(`\n[AutoSnipe] Monitoring for 60s... (target: ${targetMultiplier}x)`));
                    const start = Date.now();
                    while (Date.now() - start < timeout) {
                        const currentPrice = await getTokenPrice(mint);
                        console.log(chalk.gray(`[AutoSnipe] Price: ${currentPrice} SOL | Target: ${(initialPrice * targetMultiplier).toFixed(6)} SOL`));
                        if (currentPrice >= initialPrice * targetMultiplier) {
                            console.log(chalk.green(`🎯 Threshold reached (${currentPrice} >= ${initialPrice * targetMultiplier})`));
                            await bundler.sellTokens();
                            break;
                        }
                        await sleep(interval);
                    }
                    if (Date.now() - start >= timeout) {
                        console.log(chalk.yellow(`⏰ AutoSnipe timeout - target not reached in 60s.`));
                    }
                } catch (e) {
                    console.log(chalk.red(`❌ Error in auto-snipe option: ${e}`));
                }
                break;

            default:
                console.log(chalk.red("\nInvalid option"));
        }
    }
}

main().catch(e => {
    console.log(chalk.red("FATAL ERROR:"), e);
    process.exit(1);
});