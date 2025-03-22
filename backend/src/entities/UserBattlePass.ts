import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User"
import { BattlePass } from "./BattlePass"

@Entity("UserBattlePass")
export class UserBattlePass {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.userBattlePasses)
    user: User

    @ManyToOne(() => BattlePass, (battlePass) => battlePass.userBattlePasses)
    battlePass: BattlePass

    @Column({ default: 0 })
    progress: number // Progress within the battle pass stage

    @Column({ default: false })
    levelClosed: boolean // Indicates if the user has closed this battle pass level
}
