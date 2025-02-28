# 🦍 Gorillix: AI-Powered Decentralized Exchange

## 📝 Overview

Gorillix is an innovative decentralized exchange (DEX) that offers flexible trading options through both manual and AI-based approaches, focusing on interactions between Token A and Token B.

## Smart Contracts

The following smart contracts have been deployed on ABC Testnet.

- **💰 TokenA & TokenB**: Mock tokens for single pool creation.
- **📈 Gorillix**: Lightweight AMM equipped with swap and deposit functions. The TokenA/TokenB pool is stored within the DEX and LP tokens (GOR-LP) are emitted to reward Liquidity Providers.
- **🔐 Escrow**: The place where the user can safely store the tokens that will be used by the AI Agent to trade on Gorillix.
- **🚰 Faucet**: Faucet contract that allows every user to get 10 TokenA and 10 TokenB.

Gorillix, Escrow, and Faucet are now compatible with Gelato Relay via the ERC2771Context contract, allowing for gasless transactions.

**Contract addresses:**
- **TokenA**: 0x9455bd9d1dd4a7e66e34ffc2e5de83caa92092ae
- **TokenB**: 0x1d96f7338ae4edfc835bd3d19297666c1e80b170
- **Gorillix**: 0x80e93b9420746ac25c420c3a7cc29b46bec34d26
- **Escrow**: 0xcd8aca3fba1192607a87fec234fd13ed439ff36c
- **Faucet**: 0xce02e799a74ae683fceceaada62497e82ed7cb4a
- **Trusted Forwarder (Gelato Relay)**: 0x61F2976610970AFeDc1d83229e1E21bdc3D5cbE4

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