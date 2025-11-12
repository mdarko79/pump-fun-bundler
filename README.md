# Ultimate Pump.fun Bundler

Advanced token bundler for Pump.fun platform on Solana blockchain.

## Features

- **Single-Wallet Mode**: Create and manage tokens from one wallet
- **Multi-Wallet Mode**: Distribute purchases across multiple wallets for bundling
- **Auto-Snipe Mode**: Automatically sell when price spikes
- **Automatic Trading**: Create, monitor, and sell tokens automatically
- **Real-time Price Monitoring**: Track token prices in real-time
- **Statistics Tracking**: Monitor profits, token creation, and sales

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Solana wallet with SOL
- Pump Portal API key
- QuickNode RPC endpoint (or other Solana RPC)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mdarko79/pump-fun-bundler.git
cd pump-fun-bundler
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory:
```env
PUMP_PORTAL_API_KEY=your_api_key_here
LIGHTNING_WALLET=your_wallet_public_key
RPC_URL=your_rpc_url
WS_URL=your_websocket_url
LIGHTNING_SECRET_KEY=your_secret_key_here
WALLET_COUNT=0
```

## Configuration

### Single-Wallet Mode
Set `WALLET_COUNT=0` in `.env` file. All operations will use the main Lightning wallet.

### Multi-Wallet Mode
Set `WALLET_COUNT=20` (or any number) in `.env` file. The bundler will generate and manage multiple wallets for distributed purchases.

## Usage

Run the bundler:
```bash
npm start
```

### Main Menu Options:

1. **Generate wallets** (multi-wallet only) - Creates and funds multiple wallets
2. **Create token** - Creates a new token with random name/symbol from predefined list
3. **Sell tokens** - Sells all tokens from wallet(s)
4. **Show statistics** - Displays profits, tokens created, and sales
5. **Automatic mode** - Fully automated create → monitor → sell cycle
6. **Exit** - Closes the bundler
7. **Auto-snipe mode** - Monitors for quick price spikes and sells automatically
8. **Create token + auto-snipe** - Creates token and monitors for 60 seconds

## Security Warning

⚠️ **NEVER commit your `.env` file to GitHub!**

- Keep your private keys secure
- Use environment variables for sensitive data
- The `.gitignore` file is configured to exclude sensitive files

## Project Structure
```
MyBundler/
├── main.ts          # Main application code
├── .env             # Environment variables (NOT committed)
├── _env             # Environment template (NOT committed)
├── wallets.json     # Generated wallets (NOT committed)
├── package.json     # Dependencies
├── tsconfig.json    # TypeScript configuration
└── README.md        # This file
```

## Dependencies

- @solana/web3.js - Solana blockchain interaction
- bs58 - Base58 encoding/decoding
- chalk - Terminal styling
- dotenv - Environment variable management
- node-fetch - HTTP requests
- prompt-sync - User input
- form-data - Multipart form data

## How It Works

1. **Token Creation**: 
   - Selects random token data from predefined list
   - Uploads metadata to IPFS
   - Creates token on Pump.fun
   - Optionally purchases from multiple wallets

2. **Price Monitoring**:
   - Fetches real-time price from Pump.fun API
   - Compares against profit threshold
   - Triggers sell when target reached

3. **Auto-Snipe**:
   - Monitors price changes in 200ms intervals
   - Detects rapid price increases (spikes)
   - Executes immediate sell on spike detection

## Disclaimer

This software is for educational purposes only. Use at your own risk. Trading cryptocurrencies involves substantial risk of loss. The authors are not responsible for any financial losses.

## License

MIT License - See LICENSE file for details

## Author

mdarko79

## Support

For issues and questions, please open an issue on GitHub.