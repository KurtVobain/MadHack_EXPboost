import { QubicTransaction } from '@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction'
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper'
import { clearConfigCache } from 'prettier'

const baseURL = 'https://testnet-rpc.qubic.org'

class SendQubicToken {
  private senderSeed: string
  private recipientId: string
  private amount: number
  private helper: QubicHelper

  constructor(recipientId: string, senderSeed: string, amount: number) {
    this.senderSeed = senderSeed
    this.recipientId = recipientId.trim()
    this.amount = amount
    this.helper = new QubicHelper()
  }

  async sendToken(): Promise<string> {
    // if (!this.recipientId || (this.recipientId.length !== 55 && this.recipientId.length !== 56)) {
    //   throw new Error("Invalid Qubic identity address.")
    // }

    // Fetch current tick
    const tickStatus = await fetch(`${baseURL}/v1/status`).then(res => res.json())
    const currentTick = tickStatus.lastProcessedTick.tickNumber
    const targetTick = currentTick + 15

    // Derive sender's public ID
    const sender = await this.helper.createIdPackage(this.senderSeed)
    console.log("Sender ID:", sender)

    // Build transaction
    const tx = new QubicTransaction()
      .setSourcePublicKey(sender.publicId)
      .setDestinationPublicKey(this.recipientId)
      .setAmount(this.amount)
      .setTick(targetTick)

    console.log("Transaction:", tx, tx.getPackageData())

    await tx.build(this.senderSeed)

    // Broadcast transaction
    const encoded = tx.encodeTransactionToBase64(tx.getPackageData())
    console.log("Encoded transaction:", encoded)
    const response = await fetch(`${baseURL}/v1/broadcast-transaction`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ encodedTransaction: encoded })
    })

    const json = await response.json()
    if (!response.ok) {
      throw new Error("Failed to broadcast transaction: " + JSON.stringify(json))
    }

    console.log("Transaction ID:", json.transactionId)
    return json.transactionId
  }
}

export default SendQubicToken;
