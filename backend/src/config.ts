import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, "../../.env") })

export const config = {
    db: {
        type: process.env.DB_TYPE || "postgres",
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || "user",
        password: process.env.DB_PASSWORD || "password",
        name: process.env.DB_NAME || "database",
        url: process.env.DATABASE_URL || "",
    },
    rpcUrl: process.env.RPC_URL || "https://api.devnet.solana.com",
    walletSecret: process.env.SECRET
        ? process.env.SECRET.split(",").map((num) => parseInt(num.trim(), 10))
        : [],
    jwtToken: process.env.JWT_TOKEN || "",
    sepolia_arbitrum_private_key: process.env.SEPOLIA_ARBITRUM_PRIVATE_KEY,
    sepolia_arbitrum_url: process.env.SEPOLIA_ARBITRUM_URL,
    contractAddress: process.env.SEPOLIA_CONTRACT_ADDRESS,
    ipfsApiUrl: process.env.IPFS_API_URL,
    ipfsGatewayUrl: process.env.IPFS_GATEWAY_URL,
}
