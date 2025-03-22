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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MintNFT_1 = __importDefault(require("../services/MintNFT"));
const SendSolanaToken_1 = __importDefault(require("../services/SendSolanaToken"));
const checkLearnWeb3_1 = __importDefault(require("../services/checkLearnWeb3"));
const User_1 = require("../entities/User");
const BattlePass_1 = require("../entities/BattlePass");
const UserBattlePass_1 = require("../entities/UserBattlePass");
const UserTask_1 = require("../entities/UserTask");
const data_source_1 = __importDefault(require("../data-source"));
const router = express_1.default.Router();
function getUserClosedLevels(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const battlePassRepository = data_source_1.default.getRepository(BattlePass_1.BattlePass);
        const userBattlePassRepository = data_source_1.default.getRepository(UserBattlePass_1.UserBattlePass);
        const userRepository = data_source_1.default.getRepository(User_1.User);
        const user = yield userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new Error("User not found");
        let totalExperience = user.experience;
        if (user.email.includes("mock")) {
            totalExperience = 5;
        }
        // Get all battle pass levels ordered by required experience
        const battlePassLevels = yield battlePassRepository.find({
            order: { requiredExperience: "ASC" },
        });
        let newlyClosedLevelIds = [];
        for (const level of battlePassLevels) {
            if (totalExperience >= level.requiredExperience) {
                // Check if the user has already closed this level
                let userBattlePass = yield userBattlePassRepository.findOne({
                    where: { user: user, battlePass: level },
                });
                if (!userBattlePass) {
                    // Create a new record if it doesn't exist
                    userBattlePass = userBattlePassRepository.create({
                        user: user,
                        battlePass: level,
                        progress: level.requiredExperience,
                        levelClosed: true,
                    });
                    yield userBattlePassRepository.save(userBattlePass);
                    user.balance += 5;
                    yield userRepository.save(user);
                    newlyClosedLevelIds.push(level.id);
                }
                else if (!userBattlePass.levelClosed) {
                    // Update the existing record
                    userBattlePass.levelClosed = true;
                    yield userBattlePassRepository.save(userBattlePass);
                    newlyClosedLevelIds.push(level.id);
                    console.log("Updated level:", level.id);
                    user.balance += 5;
                    yield userRepository.save(user);
                }
                else {
                    console.log("Level already closed:", level.id);
                    continue;
                }
            }
            else {
                console.log("Level not yet reached:", level.id);
                break;
            }
        }
        console.log("Newly closed levels:", newlyClosedLevelIds);
        return newlyClosedLevelIds;
    });
}
router.post("/mint-and-send-nft", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, battlepassId, destinationAddress } = req.body;
    try {
        const mintService = new MintNFT_1.default(userName, battlepassId, "image.png");
        const nftPubkey = yield mintService.mintNft();
        const sendNFTService = new SendSolanaToken_1.default(destinationAddress, nftPubkey, 1);
        const signature = yield sendNFTService.sendToken();
        res.status(200).json({
            message: "NFT minted and sent successfully",
            nftPubkey,
            transactionSignature: signature,
        });
    }
    catch (error) {
        console.error("Error in mint-and-send-nft:", error);
        res.status(500).json({ error: "Failed to mint and send NFT" });
    }
}));
router.post("/daily/check", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.query.userId || !req.query.dailyId) {
        return res
            .status(400)
            .json({ error: "Missing userId or dailyId parameter." });
    }
    const userId = Number(req.query.userId);
    const dailyId = Number(req.query.dailyId);
    const userRepository = data_source_1.default.getRepository(User_1.User);
    const user = yield userRepository.findOne({ where: { id: userId } });
    if (!user)
        throw new Error("User not found");
    try {
        let isTaskCompleted;
        if (user.email.includes("mock")) {
            isTaskCompleted = true;
            user.experience = 100;
        }
        else {
            const scraper = new checkLearnWeb3_1.default(userId, dailyId);
            isTaskCompleted = yield scraper.checkDailyCompletion();
        }
        if (!isTaskCompleted) {
            return res.status(200).json({
                isFinished: isTaskCompleted,
            });
        }
        const closedLevelIds = yield getUserClosedLevels(userId);
        const userName = user.firstName;
        const destinationAddress = user.walletAddress;
        if (!user.walletAddress) {
            throw new Error("User does not have a wallet address.");
        }
        let signature;
        const battlePassRepository = data_source_1.default.getRepository(BattlePass_1.BattlePass);
        for (const levelId of closedLevelIds) {
            const battlePass = yield battlePassRepository.findOne({
                where: {
                    id: levelId,
                },
                relations: ["awards"],
            });
            if (!battlePass) {
                continue;
            }
            const awards = battlePass.awards;
            for (const award of awards) {
                if (!award.nftId) {
                    continue;
                }
                // Proceed with NFT minting and sending
                const mintService = new MintNFT_1.default(userName, battlePass.id, award.nftId);
                const nftPubkey = yield mintService.mintNft();
                const sendNFTService = new SendSolanaToken_1.default(destinationAddress, nftPubkey, 1);
                signature = yield sendNFTService.sendToken();
                console.log(`NFT sent with signature: ${signature}`);
            }
        }
        return res.status(200).json({
            isFinished: isTaskCompleted,
            transactionURL: `https://explorer.solana.com/tx/${signature}/?cluster=devnet`,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}));
router.get("/battlepass/:battlepass_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const battlepassId = Number(req.params.battlepass_id);
    try {
        const battlePassRepository = data_source_1.default.getRepository(BattlePass_1.BattlePass);
        const battlePassLevels = yield battlePassRepository.find({
            relations: ["awards"],
        });
        if (battlePassLevels.length === 0) {
            return res.status(404).json({ error: "BattlePass not found" });
        }
        const levels = battlePassLevels.map((battlePass) => {
            const awards = battlePass.awards.map((award) => ({
                awardId: award.id,
                nftId: award.nftId,
                amount: award.amount,
            }));
            return {
                id: battlePass.id,
                title: null,
                status: true, // What is it
                isPremium: battlePass.isPremium,
                awards: awards,
                level: battlePass.stage,
                experience: battlePass.requiredExperience,
            };
        });
        const data = { levels };
        return res.status(200).json({ data });
    }
    catch (error) {
        console.error("Error in /battlepass/:battlepass_id:", error);
        return res
            .status(500)
            .json({ error: "An unexpected error occurred." });
    }
}));
router.get("/dailies", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    console.log("---: userId", userId);
    if (!userId) {
        return res.status(400).json({ error: "Missing userId parameter." });
    }
    try {
        const userTaskRepository = data_source_1.default.getRepository(UserTask_1.UserTask);
        const userTasks = yield userTaskRepository.find({
            where: { user: { id: Number(userId) } },
            relations: ["task"],
        });
        const dailies = userTasks.map((userTask) => ({
            title: userTask.task.name,
            isClosed: userTask.completed,
            dailyId: userTask.task.id,
        }));
        res.status(200).json({ data: dailies });
    }
    catch (error) {
        console.error("Error in /dailies:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
