// Probably we don't need this one
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User"
import { Task } from "./Task"

@Entity("UserTasks")
export class UserTask {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.userTasks)
    user: User

    @ManyToOne(() => Task, (task) => task.userTasks)
    task: Task

    @Column({ default: false })
    completed: boolean

    @Column({ type: "timestamp", nullable: true })
    completedDate: Date
}
