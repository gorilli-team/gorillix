# Instructions

## Goal: add AgentKit plugin from Eliza

## Steps

### Implementation Plan:

1. ✅ Add AgentKit Dependency

   - Add @elizaos/plugin-agentkit@0.1.9 to package.json dependencies

2. ✅ Configure Character.ts

   - Uncomment plugins array
   - Import AgentKit plugin
   - Add AgentKit to plugins array

3. ✅ Environment Configuration

   - Add any required AgentKit environment variables to .env and .env.example
   - Document new environment variables in README.md
     CDP_AGENT_KIT_NETWORK=base-mainnet # defaults to 'base-sepolia'
     CDP_API_KEY_NAME=
     CDP_API_KEY_PRIVATE_KEY=

4. ✅ README.md

   - Add documentation for AgentKit environment variables
   - Update any other parts of README which have changed as a result of this new plugin for AgentKit.

5. ✅ Remove modelProvider from character.ts

### Expected Outcome:

- AgentKit successfully integrated into starter project
- Clear documentation for developers
- Working demonstration of core AgentKit features

### Success Criteria:

- Project builds without errors
- AgentKit functions are accessible
- Documentation clearly explains AgentKit usage
