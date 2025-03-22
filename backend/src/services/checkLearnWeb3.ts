import { Repository } from "typeorm"
import axios, { AxiosResponse } from "axios"
import * as cheerio from "cheerio"

import { UserCourse } from "../entities/UserCourse"
import { UserTask } from "../entities/UserTask"
import { User } from "../entities/User"
import { Task } from "../entities/Task"
import AppDataSource from "../data-source"

class LearnWeb3Parser {
    private userId: number
    private dailyId?: number

    constructor(userId: number, dailyId?: number) {
        this.userId = userId
        this.dailyId = dailyId
    }

    /**
     * Makes an asynchronous GET request to the specified URL with optional query parameters.
     * @param url The URL to send the GET request to.
     * @returns The response text if successful, otherwise the error text.
     */
    public async asyncRequest(url: string): Promise<string> {
        try {
            const response: AxiosResponse<string> = await axios.get(url)
            if (response.status !== 200) {
                return response.data
            }
            return response.data
        } catch (error: any) {
            if (error.response) {
                return error.response.data
            }
            throw new Error(`Request failed: ${error.message}`)
        }
    }

    /**
     * Parses the HTML response to extract user data from a <script> tag with type 'application/json'.
     * @param html The HTML response as a string.
     */
    public async parseResponse(html: string): Promise<any> {
        const $ = cheerio.load(html)
        const scriptTag = $('script[type="application/json"]').first()

        if (!scriptTag || scriptTag.length === 0) {
            throw new Error(
                'No <script> tag with type "application/json" found.',
            )
        }

        const userDataText = scriptTag.html()

        if (!userDataText) {
            throw new Error("No JSON data found inside the <script> tag.")
        }

        let userDataJson: any
        try {
            userDataJson = JSON.parse(userDataText)
        } catch (error) {
            throw new Error("Failed to parse JSON data from the <script> tag.")
        }

        const profileData =
            userDataJson.props.pageProps.trpcState.json.queries[0].state
        return profileData
    }

    private async checkUpdates(
        oldProfileData: any,
        newProfileData: any,
    ): Promise<boolean> {
        if (!oldProfileData || !newProfileData) {
            throw new Error("Insufficient data to perform update check.")
        }

        const taskRepository: Repository<Task> =
            AppDataSource.getRepository(Task)
        const task = await taskRepository.findOne({
            where: { id: this.dailyId },
        })

        if (!task) {
            throw new Error("Task not found.")
        }

        const valueToCompare = task.completeCondition

        if (!valueToCompare) {
            throw new Error("Task does not have a completeCondition specified.")
        }

        const oldValue = oldProfileData.data[valueToCompare] || 0
        const newValue = newProfileData.data[valueToCompare] || 0

        if (oldValue > newValue) {
            return false
        }

        // Value has increased, update UserTask
        const userTaskRepository: Repository<UserTask> =
            AppDataSource.getRepository(UserTask)

        // Fetch the UserTask for the user and the task
        let userTask = await userTaskRepository.findOne({
            where: {
                user: { id: this.userId },
                task: { id: this.dailyId },
            },
            relations: ["user", "task"],
        })

        if (!userTask) {
            // Create new UserTask if it doesn't exist
            userTask = new UserTask()
            userTask.user = { id: this.userId } as User
            userTask.task = { id: this.dailyId } as Task
        }

        // Update the UserTask
        userTask.completed = true
        userTask.completedDate = new Date()
        await userTaskRepository.save(userTask)

        const userRepository: Repository<User> =
            AppDataSource.getRepository(User)

        const user = await userRepository.findOne({
            where: { id: this.userId },
        })

        if (!user) {
            throw new Error("User not found.")
        }

        // Update the User experience
        user.experience += task.experience
        await userRepository.save(user)

        return true
    }

    /**
     * Public method to fetch and process data from the specified URL.
     * @param url The URL to scrape data from.
     */
    public async checkDailyCompletion(): Promise<boolean> {
        const userCourseRepository: Repository<UserCourse> =
            AppDataSource.getRepository(UserCourse)

        const userCourse = await userCourseRepository.findOne({
            where: {
                user: { id: this.userId },
                course: { id: 1 }, // Should be 1 courseID
            },
            relations: ["user", "course"],
        })

        if (!userCourse) {
            throw new Error("UserCourse not found.")
        }

        const oldProfileData = userCourse.parsedData
        const userName = userCourse.nickname

        const url = `https://learnweb3.io/u/${userName}/`
        const response = await this.asyncRequest(url)
        const newProfileData = await this.parseResponse(response)

        const isTaskCompleted = this.checkUpdates(
            oldProfileData,
            newProfileData,
        )

        userCourse.parsedData = newProfileData
        await userCourseRepository.save(userCourse)

        return isTaskCompleted
    }
}

export default LearnWeb3Parser
