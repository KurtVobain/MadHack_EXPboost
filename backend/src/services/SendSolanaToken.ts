import {
    getOrCreateAssociatedTokenAccount,
    createTransferInstruction,
} from "@solana/spl-token"
import {
    Connection,
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
    Transaction,
} from "@solana/web3.js"
import { config } from "../config"

class SendNFT {
    private connection: Connection
    private fromKeypair: Keypair
    private destinationAddress: PublicKey
    private mintAddress: PublicKey
    private transferAmount: number

    constructor(
        destinationAddress: string,
        mintAddress: string,
        amount: number
    ) {
        this.connection = new Connection(config.rpcUrl)

        this.destinationAddress = new PublicKey(destinationAddress)
        this.mintAddress = new PublicKey(mintAddress)

        this.transferAmount = amount

        this.fromKeypair = Keypair.fromSecretKey(
            new Uint8Array(config.walletSecret)
        )
    }

    async sendToken(): Promise<string> {
        let sourceAccount = await getOrCreateAssociatedTokenAccount(
            this.connection,
            this.fromKeypair,
            this.mintAddress,
            this.fromKeypair.publicKey
        )

        let destinationAccount = await getOrCreateAssociatedTokenAccount(
            this.connection,
            this.fromKeypair,
            this.mintAddress,
            this.destinationAddress
        )

        const tx = new Transaction()
        tx.add(
            createTransferInstruction(
                sourceAccount.address,
                destinationAccount.address,
                this.fromKeypair.publicKey,
                this.transferAmount
            )
        )

        const latestBlockHash = await this.connection.getLatestBlockhash(
            "confirmed"
        )
        tx.recentBlockhash = await latestBlockHash.blockhash
        const signature = await sendAndConfirmTransaction(this.connection, tx, [
            this.fromKeypair,
        ])

        console.log(`Transaction successful with signature: ${signature}`)
        return signature
    }
}

export default SendNFT
