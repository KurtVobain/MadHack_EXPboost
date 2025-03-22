import { Router, Request, Response } from "express"
import { Repository } from "typeorm"
import AppDataSource from "../data-source"
import { User } from "../entities/User"

const router = Router()

router.get("/profile/:user_id", async (req: Request, res: Response) => {
    const userId = Number(req.params.user_id)

    try {
        const userRepository: Repository<User> =
            AppDataSource.getRepository(User)

        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ["userBattlePasses", "userBattlePasses.battlePass"],
        })

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const userBattlePasses = user.userBattlePasses.sort(
            (a, b) => a.battlePass.stage - b.battlePass.stage
        )

        const unclosedUserBattlePass = userBattlePasses.find(
            (ubp) => !ubp.levelClosed
        )

        let currentBattlePassLevel: number

        if (unclosedUserBattlePass) {
            currentBattlePassLevel = unclosedUserBattlePass.battlePass.stage
        } else if (userBattlePasses.length > 0) {
            const lastBattlePassId =
                userBattlePasses[userBattlePasses.length - 1].battlePass.stage
            currentBattlePassLevel = lastBattlePassId + 1
        } else {
            currentBattlePassLevel = 1
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
        }

        return res.status(200).json({ data })
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
})

export default router
