import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { UserBattlePass } from "./UserBattlePass"
import { Award } from "./Award"

@Entity("BattlePass")
export class BattlePass {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    stage: number

    @Column()
    requiredExperience: number

    @Column()
    reward: string

    @Column({ default: false })
    isPremium: boolean

    @OneToMany(
        () => UserBattlePass,
        (userBattlePass) => userBattlePass.battlePass
    )
    userBattlePasses: UserBattlePass[]

    @OneToMany(() => Award, (award) => award.userBattlePass)
    awards: Award[]
}
