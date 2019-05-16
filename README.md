# LotionJS Sidechains Demo
1. Run `node fullNode` to start a full LotionJS node. This will write the node's GCI to `network/config/config.json`.
2. In a separate terminal, run `node lightClient_1`. This runs a light client that automatically connects to the full node. It adds an account to the state, then sends funds to another account.
3. In a separate terminal, run `node lightClient_2`. This runs a light client that automatically connects to the full node. It adds an account to the state, then sends funds to another account.