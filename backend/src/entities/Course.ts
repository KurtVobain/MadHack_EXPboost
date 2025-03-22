import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { CourseTask } from "./CourseTask"
import { UserCourse } from "./UserCourse"

@Entity("Courses")
export class Course {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    url: string

    @OneToMany(() => CourseTask, (courseTask) => courseTask.course)
    courseTasks: CourseTask[]

    @OneToMany(() => UserCourse, (userCourse) => userCourse.course)
    userCourses: UserCourse[]
}
