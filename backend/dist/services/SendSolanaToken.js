"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const config_1 = require("../config");
class SendNFT {
    constructor(destinationAddress, mintAddress, amount) {
        this.connection = new web3_js_1.Connection(config_1.config.rpcUrl);
        this.destinationAddress = new web3_js_1.PublicKey(destinationAddress);
        this.mintAddress = new web3_js_1.PublicKey(mintAddress);
        this.transferAmount = amount;
        this.fromKeypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(config_1.config.walletSecret));
    }
    sendToken() {
        return __awaiter(this, void 0, void 0, function* () {
            let sourceAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(this.connection, this.fromKeypair, this.mintAddress, this.fromKeypair.publicKey);
            let destinationAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(this.connection, this.fromKeypair, this.mintAddress, this.destinationAddress);
            const tx = new web3_js_1.Transaction();
            tx.add((0, spl_token_1.createTransferInstruction)(sourceAccount.address, destinationAccount.address, this.fromKeypair.publicKey, this.transferAmount));
            const latestBlockHash = yield this.connection.getLatestBlockhash("confirmed");
            tx.recentBlockhash = yield latestBlockHash.blockhash;
            const signature = yield (0, web3_js_1.sendAndConfirmTransaction)(this.connection, tx, [
                this.fromKeypair,
            ]);
            console.log(`Transaction successful with signature: ${signature}`);
            return signature;
        });
    }
}
exports.default = SendNFT;
