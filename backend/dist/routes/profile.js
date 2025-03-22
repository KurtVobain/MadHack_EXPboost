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
const express_1 = require("express");
const data_source_1 = __importDefault(require("../data-source"));
const User_1 = require("../entities/User");
const router = (0, express_1.Router)();
router.get("/profile/:user_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.user_id);
    try {
        const userRepository = data_source_1.default.getRepository(User_1.User);
        const user = yield userRepository.findOne({
            where: { id: userId },
            relations: ["userBattlePasses", "userBattlePasses.battlePass"],
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const userBattlePasses = user.userBattlePasses.sort((a, b) => a.battlePass.stage - b.battlePass.stage);
        const unclosedUserBattlePass = userBattlePasses.find((ubp) => !ubp.levelClosed);
        let currentBattlePassLevel;
        if (unclosedUserBattlePass) {
            currentBattlePassLevel = unclosedUserBattlePass.battlePass.stage;
        }
        else if (userBattlePasses.length > 0) {
            const lastBattlePassId = userBattlePasses[userBattlePasses.length - 1].battlePass.stage;
            currentBattlePassLevel = lastBattlePassId + 1;
        }
        else {
            currentBattlePassLevel = 1;
        }
        const data = {
            userName: `${user.firstName} ${user.lastName}`,
            experience: user.experience,
            profile_level: 1,
            current_battlepass_id: 0,
            current_battlepass_level: currentBattlePassLevel,
            current_battlepass_experience: user.experience,
            balance: user.balance,
            is_premium: user.isPremium,
        };
        return res.status(200).json({ data });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
