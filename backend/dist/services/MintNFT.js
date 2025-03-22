"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
const umi_1 = require("@metaplex-foundation/umi");
const umi_storage_mock_1 = require("@metaplex-foundation/umi-storage-mock");
const fs = __importStar(require("fs"));
const config_1 = require("../config");
class MintSolanaNFTService {
    constructor(userName, battlepassId, nftID) {
        this.umi = (0, umi_bundle_defaults_1.createUmi)(config_1.config.rpcUrl);
        if (config_1.config.walletSecret.length === 0) {
            throw new Error("Wallet secret is not defined or empty.");
        }
        this.nftID = nftID; // NFT file name
        const secretKey = new Uint8Array(config_1.config.walletSecret);
        this.creatorWallet =
            this.umi.eddsa.createKeypairFromSecretKey(secretKey);
        this.creator = (0, umi_1.createSignerFromKeypair)(this.umi, this.creatorWallet);
        this.umi
            .use((0, umi_1.keypairIdentity)(this.creator))
            .use((0, mpl_token_metadata_1.mplTokenMetadata)())
            .use((0, umi_storage_mock_1.mockStorage)());
        this.nftDetail = {
            name: `${userName} Battlepass ${battlepassId}`,
            symbol: `BP${battlepassId}`,
            uri: "IPFS_URL_OF_METADATA",
            royalties: 5.5,
            description: `${userName}'s Battlepass ${battlepassId} NFT!`,
            imgType: "image/png",
            attributes: [{ trait_type: "Speed", value: "Quick" }],
        };
    }
    uploadImage() {
        return __awaiter(this, void 0, void 0, function* () {
            const imgDirectory = `${__dirname}/../public/rewards`;
            const imgName = `${this.nftID}.png`;
            const filePath = `${imgDirectory}/${imgName}`;
            if (!fs.existsSync(filePath)) {
                throw new Error(`Image file not found at path: ${filePath}, currentDir: ${__dirname}`);
            }
            const fileBuffer = fs.readFileSync(filePath);
            const image = (0, umi_1.createGenericFile)(fileBuffer, imgName, {
                uniqueName: this.nftDetail.name,
                contentType: this.nftDetail.imgType,
            });
            try {
                const [imgUri] = yield this.umi.uploader.upload([image]);
                console.log("Uploaded image:", imgUri);
                return imgUri;
            }
            catch (error) {
                console.error("Error uploading image to NFT storage:", error);
                throw new Error("Image upload failed.");
            }
        });
    }
    uploadMetadata(imageUri) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadata = {
                name: this.nftDetail.name,
                description: this.nftDetail.description,
                image: imageUri,
                attributes: this.nftDetail.attributes,
                properties: {
                    files: [
                        {
                            type: this.nftDetail.imgType,
                            uri: imageUri,
                        },
                    ],
                },
            };
            try {
                const metadataUri = yield this.umi.uploader.uploadJson(metadata);
                console.log("Uploaded metadata:", metadataUri);
                return metadataUri;
            }
            catch (error) {
                console.error("Error uploading metadata to NFT storage:", error);
                throw new Error("Metadata upload failed.");
            }
        });
    }
    mintNft() {
        return __awaiter(this, void 0, void 0, function* () {
            const imageUri = yield this.uploadImage();
            const metadataUri = yield this.uploadMetadata(imageUri);
            try {
                const mint = (0, umi_1.generateSigner)(this.umi);
                yield (0, mpl_token_metadata_1.createNft)(this.umi, {
                    mint,
                    name: this.nftDetail.name,
                    symbol: this.nftDetail.symbol,
                    uri: metadataUri,
                    sellerFeeBasisPoints: (0, umi_1.percentAmount)(this.nftDetail.royalties),
                    creators: [
                        {
                            address: this.creator.publicKey,
                            verified: true,
                            share: 100,
                        },
                    ],
                }).sendAndConfirm(this.umi);
                let nftPubkey = mint.publicKey.toString();
                console.log(`Created NFT: ${nftPubkey}`);
                return nftPubkey;
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.default = MintSolanaNFTService;
