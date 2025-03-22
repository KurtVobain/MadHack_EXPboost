"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const UserCourse_1 = require("../entities/UserCourse");
const UserTask_1 = require("../entities/UserTask");
const User_1 = require("../entities/User");
const Task_1 = require("../entities/Task");
const data_source_1 = __importDefault(require("../data-source"));
class LearnWeb3Parser {
    constructor(userId, dailyId) {
        this.userId = userId;
        this.dailyId = dailyId;
    }
    /**
     * Makes an asynchronous GET request to the specified URL with optional query parameters.
     * @param url The URL to send the GET request to.
     * @returns The response text if successful, otherwise the error text.
     */
    asyncRequest(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(url);
                if (response.status !== 200) {
                    return response.data;
                }
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    return error.response.data;
                }
                throw new Error(`Request failed: ${error.message}`);
            }
        });
    }
    /**
     * Parses the HTML response to extract user data from a <script> tag with type 'application/json'.
     * @param html The HTML response as a string.
     */
    parseResponse(html) {
        return __awaiter(this, void 0, void 0, function* () {
            const $ = cheerio.load(html);
            const scriptTag = $('script[type="application/json"]').first();
            if (!scriptTag || scriptTag.length === 0) {
                throw new Error('No <script> tag with type "application/json" found.');
            }
            const userDataText = scriptTag.html();
            if (!userDataText) {
                throw new Error("No JSON data found inside the <script> tag.");
            }
            let userDataJson;
            try {
                userDataJson = JSON.parse(userDataText);
            }
            catch (error) {
                throw new Error("Failed to parse JSON data from the <script> tag.");
            }
            const profileData = userDataJson.props.pageProps.trpcState.json.queries[0].state;
            return profileData;
        });
    }
    checkUpdates(oldProfileData, newProfileData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!oldProfileData || !newProfileData) {
                throw new Error("Insufficient data to perform update check.");
            }
            const taskRepository = data_source_1.default.getRepository(Task_1.Task);
            const task = yield taskRepository.findOne({
                where: { id: this.dailyId },
            });
            if (!task) {
                throw new Error("Task not found.");
            }
            const valueToCompare = task.completeCondition;
            if (!valueToCompare) {
                throw new Error("Task does not have a completeCondition specified.");
            }
            const oldValue = oldProfileData.data[valueToCompare] || 0;
            const newValue = newProfileData.data[valueToCompare] || 0;
            if (oldValue > newValue) {
                return false;
            }
            // Value has increased, update UserTask
            const userTaskRepository = data_source_1.default.getRepository(UserTask_1.UserTask);
            // Fetch the UserTask for the user and the task
            let userTask = yield userTaskRepository.findOne({
                where: {
                    user: { id: this.userId },
                    task: { id: this.dailyId },
                },
                relations: ["user", "task"],
            });
            if (!userTask) {
                // Create new UserTask if it doesn't exist
                userTask = new UserTask_1.UserTask();
                userTask.user = { id: this.userId };
                userTask.task = { id: this.dailyId };
            }
            // Update the UserTask
            userTask.completed = true;
            userTask.completedDate = new Date();
            yield userTaskRepository.save(userTask);
            const userRepository = data_source_1.default.getRepository(User_1.User);
            const user = yield userRepository.findOne({
                where: { id: this.userId },
            });
            if (!user) {
                throw new Error("User not found.");
            }
            // Update the User experience
            user.experience += task.experience;
            yield userRepository.save(user);
            return true;
        });
    }
    /**
     * Public method to fetch and process data from the specified URL.
     * @param url The URL to scrape data from.
     */
    checkDailyCompletion() {
        return __awaiter(this, void 0, void 0, function* () {
            const userCourseRepository = data_source_1.default.getRepository(UserCourse_1.UserCourse);
            const userCourse = yield userCourseRepository.findOne({
                where: {
                    user: { id: this.userId },
                    course: { id: 1 }, // Should be 1 courseID
                },
                relations: ["user", "course"],
            });
            if (!userCourse) {
                throw new Error("UserCourse not found.");
            }
            const oldProfileData = userCourse.parsedData;
            const userName = userCourse.nickname;
            const url = `https://learnweb3.io/u/${userName}/`;
            const response = yield this.asyncRequest(url);
            const newProfileData = yield this.parseResponse(response);
            const isTaskCompleted = this.checkUpdates(oldProfileData, newProfileData);
            userCourse.parsedData = newProfileData;
            yield userCourseRepository.save(userCourse);
            return isTaskCompleted;
        });
    }
}
exports.default = LearnWeb3Parser;
