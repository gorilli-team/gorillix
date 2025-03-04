# 🦍 Gorillix: AI-Powered Decentralized Exchange

## 📝 Overview

Gorillix is an innovative decentralized exchange (DEX) that offers flexible trading options through both manual and AI-based approaches, focusing on interactions between Token A and Token B.

## 🚀 Getting Started

### Repository Setup

#### Frontend

```
# Clone the repository
git clone https://github.com/gorilli-team/gorillix/tree/main/frontend
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

#### Backend

```
# Clone the repository
git clone https://github.com/gorilli-team/gorillix/tree/main/backend
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

#### Agent

```
# Clone the repository
git clone https://github.com/gorilli-team/gorillix/tree/main/gelato-agent
cd gelato-agent

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

## Smart Contracts

The following smart contracts have been deployed on ABC Testnet.

- **💰 TokenA & TokenB**: Mock tokens for single pool creation.
- **📈 Gorillix**: Lightweight AMM equipped with swap and deposit functions. The TokenA/TokenB pool is stored within the DEX and LP tokens (GOR-LP) are emitted to reward Liquidity Providers.
- **🔐 Escrow**: The place where the user can safely store the tokens that will be used by the AI Agent to trade on Gorillix.
- **🚰 Faucet**: Faucet contract that allows every user to get 10 TokenA and 10 TokenB.

Faucet is now compatible with Gelato Relay via the ERC2771Context contract, allowing for gasless transactions. The user will be able to obtain FREE TokenA and TokenB without having to pay any gas.

**Contract addresses:**

- **TokenA**: 0x9455bd9d1dd4a7e66e34ffc2e5de83caa92092ae
- **TokenB**: 0x1d96f7338ae4edfc835bd3d19297666c1e80b170
- **Gorillix**: 0x80e93b9420746ac25c420c3a7cc29b46bec34d26
- **Escrow**: 0xcd8aca3fba1192607a87fec234fd13ed439ff36c
- **Faucet**: 0xce02e799a74ae683fceceaada62497e82ed7cb4a
- **Trusted Forwarder (Gelato Relay)**: 0x61F2976610970AFeDc1d83229e1E21bdc3D5cbE4

## 💫 Trading Modes

### 1️⃣ Manual Trading

- Users connect their wallet
- Direct swap between Token A and Token B
- Manual liquidity management (add/remove)
- Full user control over trading operations

### 2️⃣ AI Agent Trading

The standard implementation would require the agent to directly access the user's wallet to:

- Withdraw Token A and Token B needed for operations
- Execute swaps between tokens
- Add/remove liquidity in pools
- Automatically manage trading operations

However, to ensure greater security, we propose implementing an escrow-based system:

#### 🔐 Escrow Mechanism

- The user will decide the amount of TokenA and TokenB to be managed by the AI Agent
- The intended amount will be deposited by the user in the Escrow contract
- The owner of the Escrow contract will have 100% rights over the funds stored in the contract
- The AI Agent will be able to withdraw a certain amount of TokenA and TokenB for its operations of Gorillix DEX
- Once the AI Agent is done with its trading strategy, it will return the funds in the Escrow contract
- The user will then be able to withdraw the funds with either a profit or a loss

## 🔄 Token Management Scenarios

### Scenario 1: Manual Trading

- User receives Token A and Token B via faucet
- Connects wallet to the Gorillix application
- Has full control over operations:
  - Swap between Token A and Token B
  - Add/remove liquidity in Token A/Token B pool

### Scenario 2: AI Agent Trading

#### Initial Setup:

- User connects wallet
- Deposits a specified amount of Token A and Token B in the multi-token vault
- Configures agent parameters

#### Agent Operations:

- Agent withdraws necessary tokens FROM THE ESCROW (not from the wallet)
- Executes trading operations on the DEX (swap, add/remove liquidity)
- Operates exclusively within the limits of available tokens in the vault

## ⚙️ Trading Configurations

### Trading Strategy

**LIQUIDITY MANAGEMENT**

**SWAP**

### Risk Levels

**1** Very Conservative

**2** Conservative

**3** Moderate

**4** Aggressive

**5** Degen

## 🛠 Technical Stack

- Frontend: `Next.js` with `Rainbow Wallet`
- Backend: `Express.js` with `MongoDB`
- Network: `ABC Testnet`

## Diagram

![Gorillix DEX](./VaultAndEscrow.png)
