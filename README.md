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
- **TokenA**: 0x4110db11e9fc29f645634091fef35a732ac6359a
- **TokenB**: 0xf2769f12882151cc15b78f7a0f07d4c04bc7aa31
- **Gorillix**: 0x14a678f6f5f5f897692a9db3dee8e2d3c656c483
- **Escrow**: 0xdb8e20f8f51522b2053be0253bd54fab902b36bb
- **Faucet**: 0x76995801f053d689f7e06e5e23e984caa31fbcf8
- **Trusted Forwarder (Gelato Relay)**: 0xd8253782c45a12053594b9deB72d8e8aB2Fca54c

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

However, to ensure greater security, we propose implementing an escrow-based system:

#### 🔐 Escrow Mechanism

* The user will decide the amount of TokenA and TokenB to be managed by the AI Agent
* The intended amount will be deposited by the user in the Escrow contract
* The owner of the Escrow contract will have 100% rights over the funds stored in the contract
* The AI Agent will be able to withdraw a certain amount of TokenA and TokenB for its operations of Gorillix DEX
* Once the AI Agent is done with its trading strategy, it will return the funds in the Escrow contract
* The user will then be able to withdraw the funds with either a profit or a loss

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
