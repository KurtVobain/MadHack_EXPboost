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
exports.BattlePass = void 0;
const typeorm_1 = require("typeorm");
const UserBattlePass_1 = require("./UserBattlePass");
const Award_1 = require("./Award");
let BattlePass = class BattlePass {
};
exports.BattlePass = BattlePass;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BattlePass.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BattlePass.prototype, "stage", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], BattlePass.prototype, "requiredExperience", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BattlePass.prototype, "reward", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], BattlePass.prototype, "isPremium", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserBattlePass_1.UserBattlePass, (userBattlePass) => userBattlePass.battlePass),
    __metadata("design:type", Array)
], BattlePass.prototype, "userBattlePasses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Award_1.Award, (award) => award.userBattlePass),
    __metadata("design:type", Array)
], BattlePass.prototype, "awards", void 0);
exports.BattlePass = BattlePass = __decorate([
    (0, typeorm_1.Entity)("BattlePass")
], BattlePass);
