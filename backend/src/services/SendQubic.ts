import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper'
import { QubicConnector } from '@qubic-lib/qubic-ts-library/dist/qubicConnector'


class SendQubicToken {
  private connector: QubicConnector
  private helper: QubicHelper
  private senderSeed: string
  private recipient: string
  private amount: bigint

  constructor(nodeUrl: string, senderSeed: string, recipient: string, amount: number) {
    this.connector = new QubicConnector(nodeUrl)
    this.helper = new QubicHelper()
    this.senderSeed = senderSeed
    this.recipient = recipient
    this.amount = BigInt(amount)
  }

  async send(): Promise<string> {
    const senderId = await this.helper.createIdPackage(this.senderSeed)
    const tick = await this.connector.getCurrentTick()
    const tx = await this.helper.createTransferTransaction({
      senderIdPackage: senderId,
      tick: tick + 5,
      recipientIdentity: this.recipient,
      amount: this.amount
    })

    const result = await this.connector.sendTransaction(tx)
    if (!result.success) {
      throw new Error("Transaction failed: " + result.message)
    }
    return result.txId
  }
}

export default SendQubicToken;