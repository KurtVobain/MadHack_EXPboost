import { Repository } from "typeorm"
import express, { Request, Response } from "express"
import SendQubicToken from "../services/SendQubic"
import LearnWeb3Parser from "../services/checkLearnWeb3"
import { User } from "../entities/User"
import { BattlePass } from "../entities/BattlePass"
import { UserBattlePass } from "../entities/UserBattlePass"
import { UserTask } from "../entities/UserTask"
import AppDataSource from "../data-source"

const router = express.Router()

interface MintAndSendNFTRequest {
    userName: string
    battlepassId: number
    destinationAddress: string
}

async function getUserClosedLevels(userId: number): Promise<number[]> {
    const battlePassRepository: Repository<BattlePass> =
        AppDataSource.getRepository(BattlePass)
    const userBattlePassRepository: Repository<UserBattlePass> =
        AppDataSource.getRepository(UserBattlePass)
    const userRepository: Repository<User> = AppDataSource.getRepository(User)

    const user = await userRepository.findOne({ where: { id: userId } })
    if (!user) throw new Error("User not found")
    let totalExperience = user.experience
    if (user.email.includes("mock")) {
        totalExperience = 5
    }

    // Get all battle pass levels ordered by required experience
    const battlePassLevels = await battlePassRepository.find({
        order: { requiredExperience: "ASC" },
    })

    let newlyClosedLevelIds: number[] = []

    for (const level of battlePassLevels) {
        if (totalExperience >= level.requiredExperience) {
            // Check if the user has already closed this level
            let userBattlePass = await userBattlePassRepository.findOne({
                where: { user: user, battlePass: level },
            })

            if (!userBattlePass) {
                // Create a new record if it doesn't exist
                userBattlePass = userBattlePassRepository.create({
                    user: user,
                    battlePass: level,
                    progress: level.requiredExperience,
                    levelClosed: true,
                })
                await userBattlePassRepository.save(userBattlePass)
                user.balance += 5
                await userRepository.save(user)
                newlyClosedLevelIds.push(level.id)
            } else if (!userBattlePass.levelClosed) {
                // Update the existing record
                userBattlePass.levelClosed = true
                await userBattlePassRepository.save(userBattlePass)
                newlyClosedLevelIds.push(level.id)
                console.log("Updated level:", level.id)
                user.balance += 5
                await userRepository.save(user)
            } else {
                console.log("Level already closed:", level.id)
                continue
            }
        } else {
            console.log("Level not yet reached:", level.id)
            break
        }
    }

    console.log("Newly closed levels:", newlyClosedLevelIds)
    return newlyClosedLevelIds
}

router.post(
    "/send-qubic",
    async (req: Request, res: Response) => {
      const { destinationAddress } = req.body
  
      if (!destinationAddress) {
        return res.status(400).json({ error: "Missing destinationAddress" })
      }
  
      try {
        const senderSeed = "fwqatwliqyszxivzgtyyfllymopjimkyoreolgyflsnfpcytkhagqii"
        const amount = 1000000 // 1 QU
        console.log("Sending 1 QU to", destinationAddress)
        const sendQubic = new SendQubicToken(destinationAddress, senderSeed, amount)
        console.log("Sending Qubic token...", sendQubic)
        const txId = await sendQubic.sendToken()
        console.log("Qubic sent:", txId)
  
        res.status(200).json({ message: "ok", transactionId: txId })
      } catch (error: any) {
        console.error("Error in /send-qubic:", error)
        res.status(500).json({ error: error.message || "Failed to send Qubic tokens" })
      }
    }
  )

router.post("/daily/check", async (req: Request, res: Response) => {
    if (!req.query.userId || !req.query.dailyId) {
        return res
            .status(400)
            .json({ error: "Missing userId or dailyId parameter." })
    }

    const userId = Number(req.query.userId)
    const dailyId = Number(req.query.dailyId)

    const userRepository: Repository<User> = AppDataSource.getRepository(User)
    const user = await userRepository.findOne({ where: { id: userId } })
    if (!user) throw new Error("User not found")
    try {
        let isTaskCompleted
        if (user.email.includes("mock")) {
            isTaskCompleted = true
            user.experience = 100
        } else {
            const scraper = new LearnWeb3Parser(userId, dailyId)
            isTaskCompleted = await scraper.checkDailyCompletion()
        }

        if (!isTaskCompleted) {
            return res.status(200).json({
                isFinished: isTaskCompleted,
            })
        }

        const closedLevelIds = await getUserClosedLevels(userId)

        const userName = user.firstName
        const destinationAddress = user.walletAddress
        if (!user.walletAddress) {
            throw new Error("User does not have a wallet address.")
        }

        let txId
        const battlePassRepository = AppDataSource.getRepository(BattlePass)
        for (const levelId of closedLevelIds) {
            const battlePass = await battlePassRepository.findOne({
                where: {
                    id: levelId,
                },
                relations: ["awards"],
            })

            if (!battlePass) {
                continue
            }

            const senderSeed = "fwqatwliqyszxivzgtyyfllymopjimkyoreolgyflsnfpcytkhagqii"
            const amount = 1000000 // 1 QU
        
            const sendQubic = new SendQubicToken(destinationAddress, senderSeed, amount)
            txId = await sendQubic.sendToken()

            console.log(`Qubic sent: ${txId}`)

        }

        return res.status(200).json({
            isFinished: isTaskCompleted,
            transactionURL: `https://testnet.explorer.qubic.org/network/tx/${txId}?type=latest`,
        })
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
})

router.get(
    "/battlepass/:battlepass_id",
    async (req: Request, res: Response) => {
        const battlepassId = Number(req.params.battlepass_id)

        try {
            const battlePassRepository: Repository<BattlePass> =
                AppDataSource.getRepository(BattlePass)

            const battlePassLevels = await battlePassRepository.find({
                relations: ["awards"],
            })

            if (battlePassLevels.length === 0) {
                return res.status(404).json({ error: "BattlePass not found" })
            }

            const levels = battlePassLevels.map((battlePass) => {
                const awards = battlePass.awards.map((award) => ({
                    awardId: award.id,
                    nftId: award.nftId,
                    amount: award.amount,
                }))

                return {
                    id: battlePass.id,
                    title: null,
                    status: true, // What is it
                    isPremium: battlePass.isPremium,
                    awards: awards,
                    level: battlePass.stage,
                    experience: battlePass.requiredExperience,
                }
            })

            const data = { levels }

            return res.status(200).json({ data })
        } catch (error: any) {
            console.error("Error in /battlepass/:battlepass_id:", error)
            return res
                .status(500)
                .json({ error: "An unexpected error occurred." })
        }
    },
)

router.get("/dailies", async (req: Request, res: Response) => {
    const { userId } = req.query
    console.log("---: userId", userId)

    if (!userId) {
        return res.status(400).json({ error: "Missing userId parameter." })
    }

    try {
        const userTaskRepository = AppDataSource.getRepository(UserTask)

        const userTasks = await userTaskRepository.find({
            where: { user: { id: Number(userId) } },
            relations: ["task"],
        })

        const dailies = userTasks.map((userTask) => ({
            title: userTask.task.name,
            isClosed: userTask.completed,
            dailyId: userTask.task.id,
        }))

        res.status(200).json({ data: dailies })
    } catch (error) {
        console.error("Error in /dailies:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

export default router