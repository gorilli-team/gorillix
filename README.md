# 🦍 Gorillix: AI-Powered Decentralized Exchange

## 📝 Overview

Gorillix is an innovative decentralized exchange (DEX) that offers flexible trading options through both manual and AI-based approaches, focusing on interactions between Token A and Token B.

## Smart Contracts

The following smart contracts have been deployed on ABC Testnet.

- **💰 TokenA & TokenB**: Mock tokens for single pool creation.
- **📈 Gorillix**: Lightweight AMM equipped with swap and deposit functions. The TokenA/TokenB pool is stored within the DEX and LP tokens (GOR-LP) are emitted to reward Liquidity Providers.

Gorillix is compatible with Gelato Relay via the ERC2771Context contract, allowing for gasless transactions.

**Contract addresses:**
- **TokenA**: 0xAaAaAAaAaaAAaAaAAaAaAaaAaAaaAAaAAaAaAaA;
- **TokenB**: 0xBbBBbBbbBBbBBbBbBbBbbBbbBBbBbBBbBBbBbBb;
- **Gorillix**: 0xGgGGgGggGGgGGgGgGgGgGggGGgGGgGGgGGgGGg;
- **Trusted Forwarder (Gelato Relay)**: 0xTtTTtTttTTtTTtTtTtTtTttTTtTTtTTtTTtTTt;

## 💫 Trading Modes

### 1️⃣ Manual Trading

* Users connect their wallet
* Direct swap between Token A and Token B
* Manual liquidity management (add/remove)
* Full user control over trading operations

### 2️⃣ AI Agent Trading

The standard implementation would require the agent to directly access the user's wallet to:

* Withdraw Token A and Token B needed for operations
* Execute swaps between tokens
* Add/remove liquidity in pools
* Automatically manage trading operations

However, to ensure greater security, we propose implementing a vault-based system:

#### 🔒 Vault Mechanism

* Instead of giving direct wallet access to the agent, the user deposits a specified amount of Token A and Token B in a multi-token vault
* The agent can access and operate ONLY on tokens present in the vault
* This approach significantly limits operational risk, as:
 * The agent never has direct access to the user's wallet
 * Exposure is limited to only the tokens deposited in the vault
 * The user maintains complete control over tokens in the main wallet

## 🔄 Token Management Scenarios

### Scenario 1: Manual Trading

* User receives Token A and Token B via faucet
* Connects wallet to the Gorillix application
* Has full control over operations:
 * Swap between Token A and Token B
 * Add/remove liquidity in Token A/Token B pool

### Scenario 2: AI Agent Trading

#### Initial Setup:
* User connects wallet
* Deposits a specified amount of Token A and Token B in the multi-token vault
* Configures agent parameters

#### Agent Operations:
* Agent withdraws necessary tokens FROM THE VAULT (not from the wallet)
* Executes trading operations on the DEX (swap, add/remove liquidity)
* Operates exclusively within the limits of available tokens in the vault

## ⚙️ Trading Configurations

### Trading Strategy
* HODL
* Buy
* Sell

### Risk Levels

Determined by the percentage of tokens that the agent can use from the vault:

| Conservative
| Moderate
| Aggressive |

## 🛠 Technical Stack

* Frontend: `Next.js` with `Rainbow Wallet`
* Backend: `Express.js` with `MongoDB`
* Network: `ABC Testnet`