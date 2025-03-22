import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    Unique,
} from "typeorm"
import { User } from "./User"
import { Course } from "./Course"

@Entity("UserCourses")
@Unique(["user", "course"]) // Ensures unique combination of user and course
export class UserCourse {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.userCourses)
    user: User

    @ManyToOne(() => Course, (course) => course.userCourses)
    course: Course

    @Column()
    nickname: string // User's nickname for the specific course

    @Column("jsonb", { nullable: true })
    parsedData: any
}
