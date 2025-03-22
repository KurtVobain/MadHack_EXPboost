import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { CourseTask } from "./CourseTask"
import { UserTask } from "./UserTask"

@Entity("Tasks")
export class Task {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    text: string

    @Column()
    experience: number

    @OneToMany(() => CourseTask, (courseTask) => courseTask.task)
    courseTasks: CourseTask[]

    @OneToMany(() => UserTask, (userTask) => userTask.task)
    userTasks: UserTask[]

    @Column({ type: "date" })
    startDate: string // Start date for when the task is available

    @Column({ type: "date" })
    endDate: string // End date for when the task expires

    @Column()
    completeCondition: string
}
