import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from "typeorm"
import { Course } from "./Course"
import { Task } from "./Task"

@Entity("CourseTasks")
@Unique(["course", "task"]) // Ensures unique combinations of course and task
export class CourseTask {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Course, (course) => course.courseTasks)
    course: Course

    @ManyToOne(() => Task, (task) => task.courseTasks)
    task: Task
}
