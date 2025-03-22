"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseTask = void 0;
const typeorm_1 = require("typeorm");
const Course_1 = require("./Course");
const Task_1 = require("./Task");
let CourseTask = class CourseTask {
};
exports.CourseTask = CourseTask;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CourseTask.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Course_1.Course, (course) => course.courseTasks),
    __metadata("design:type", Course_1.Course)
], CourseTask.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Task_1.Task, (task) => task.courseTasks),
    __metadata("design:type", Task_1.Task)
], CourseTask.prototype, "task", void 0);
exports.CourseTask = CourseTask = __decorate([
    (0, typeorm_1.Entity)("CourseTasks"),
    (0, typeorm_1.Unique)(["course", "task"]) // Ensures unique combinations of course and task
], CourseTask);
