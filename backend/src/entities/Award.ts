import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { BattlePass } from "./BattlePass"

@Entity("Awards")
export class Award {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    nftId: string

    @Column({ type: "int", nullable: true })
    amount: number

    @ManyToOne(() => BattlePass, (BattlePass) => BattlePass.awards)
    userBattlePass: BattlePass
}
