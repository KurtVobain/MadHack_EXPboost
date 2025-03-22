import { QubicTransaction } from '@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction'
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper'

const baseURL = 'https://testnet-rpc.qubic.org'

// Querying the RPC status
export async function getRPCStatus() {
  const res = await fetch(`${baseURL}/v1/status`)
  const data = await res.json()
  return data
}

class SendQubicToken {
  private senderSeed: string
  private recipient: string
  private amount: number
  private helper: QubicHelper

  constructor(
    senderSeed: string,
    recipient: string,
    amount: number
  ) {
    this.senderSeed = senderSeed
    this.recipient = recipient
    this.amount = amount
    this.helper = new QubicHelper()
  }

  async send(): Promise<string> {
    // Get latest tick
    const rpcStatus = await getRPCStatus()
    const currentTick = rpcStatus.lastProcessedTick.tickNumber
    const targetTick = currentTick + 15

    // Get sender identity
    const senderId = await this.helper.createIdPackage(this.senderSeed)

    // Create and sign transaction
    const tx = new QubicTransaction()
      .setSourcePublicKey(senderId.publicId)
      .setDestinationPublicKey(this.recipient)
      .setAmount(this.amount)
      .setTick(targetTick)

    await tx.build(this.senderSeed)

    // Encode and broadcast transaction
    const encodedTransaction = tx.encodeTransactionToBase64(tx.getPackageData())
    const response = await fetch(`${baseURL}/v1/broadcast-transaction`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ encodedTransaction })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error("Transaction failed: " + JSON.stringify(result))
    }

    return result.transactionId
  }
}

export default SendQubicToken;
