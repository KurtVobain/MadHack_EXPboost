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
exports.UserTask = void 0;
// Probably we don't need this one
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Task_1 = require("./Task");
let UserTask = class UserTask {
};
exports.UserTask = UserTask;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserTask.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.userTasks),
    __metadata("design:type", User_1.User)
], UserTask.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Task_1.Task, (task) => task.userTasks),
    __metadata("design:type", Task_1.Task)
], UserTask.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserTask.prototype, "completed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], UserTask.prototype, "completedDate", void 0);
exports.UserTask = UserTask = __decorate([
    (0, typeorm_1.Entity)("UserTasks")
], UserTask);
