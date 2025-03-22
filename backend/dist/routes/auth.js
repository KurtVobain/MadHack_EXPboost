"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const config_1 = require("../config");
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const data_source_1 = __importDefault(require("../data-source"));
const User_1 = require("../entities/User");
const Course_1 = require("../entities/Course");
const UserCourse_1 = require("../entities/UserCourse");
const Task_1 = require("../entities/Task");
const UserTask_1 = require("../entities/UserTask");
const checkLearnWeb3_1 = __importDefault(require("../services/checkLearnWeb3"));
const router = (0, express_1.Router)();
router.post("/auth/register", [
    (0, express_validator_1.body)("firstName").notEmpty().withMessage("First name is required"),
    (0, express_validator_1.body)("lastName").notEmpty().withMessage("Last name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    (0, express_validator_1.body)("walletAddress")
        .notEmpty()
        .withMessage("Solana wallet address is required"),
    (0, express_validator_1.body)("learnWeb3url")
        .notEmpty()
        .withMessage("LearnWeb3 profile url is required"),
    (0, express_validator_1.body)("mock")
        .optional()
        .isBoolean()
        .withMessage("mock must be a boolean"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = data_source_1.default.getRepository(User_1.User);
    const courseRepository = data_source_1.default.getRepository(Course_1.Course);
    const userCourseRepository = data_source_1.default.getRepository(UserCourse_1.UserCourse);
    const mock = req.body.mock;
    if (!mock) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    }
    let { firstName, lastName, email, password, walletAddress, learnWeb3url, } = req.body;
    if (mock) {
        firstName = "Mock";
        lastName = "User";
        const randomNums = Math.floor(100 + Math.random() * 900);
        email = `mock${randomNums}@example.com`;
        password = "mockpassword";
        walletAddress = "wecpeUN4kDHBMDXrwhZ3KEx5sJY1TdqeoG96M6eMVB3";
        learnWeb3url = "https://learnweb3.io/u/MockUser/";
    }
    try {
        const existingUser = yield userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }
        const saltRounds = 10;
        const hashedPassword = yield bcryptjs_1.default.hash(password, saltRounds);
        const user = userRepository.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            walletAddress,
        });
        yield userRepository.save(user);
        const defaultCourseId = 1;
        const course = yield courseRepository.findOne({
            where: { id: defaultCourseId },
        });
        if (!course) {
            return res
                .status(500)
                .json({ error: "Default course not found" });
        }
        let nickname;
        try {
            const url = new URL(learnWeb3url);
            const pathname = url.pathname;
            const pathSegments = pathname.split("/");
            nickname = pathSegments[2];
            if (!nickname) {
                throw new Error();
            }
        }
        catch (error) {
            return res
                .status(400)
                .json({ error: "Invalid LearnWeb3 URL format" });
        }
        let parsedData = { data: { numBadges: 0, xp: 0 } };
        if (!mock) {
            const parser = new checkLearnWeb3_1.default(user.id);
            const html = yield parser.asyncRequest(learnWeb3url);
            parsedData = yield parser.parseResponse(html);
        }
        const userCourse = userCourseRepository.create({
            user: user,
            course: course,
            nickname: nickname,
            parsedData: parsedData,
        });
        yield userCourseRepository.save(userCourse);
        const TaskRepository = data_source_1.default.getRepository(Task_1.Task);
        const tasks = yield TaskRepository.find();
        const userTaskRepository = data_source_1.default.getRepository(UserTask_1.UserTask);
        for (const task of tasks) {
            const userTask = userTaskRepository.create({
                user: user,
                task: task,
                completed: false,
            });
            yield userTaskRepository.save(userTask);
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.config.jwtToken, {
            expiresIn: "1h",
        });
        const { password: _ } = user, userData = __rest(user, ["password"]);
        res.status(201).json({
            message: "User registered successfully",
            user: userData,
            token,
        });
    }
    catch (error) {
        console.error("Error in /auth/register:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.post("/auth/login", [
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = data_source_1.default.getRepository(User_1.User);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = yield userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.config.jwtToken, { expiresIn: "1h" });
        const { password: _ } = user, userData = __rest(user, ["password"]);
        res.status(200).json({
            message: "Login successful",
            user: userData,
            token,
        });
    }
    catch (error) {
        console.error("Error in /auth/login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
