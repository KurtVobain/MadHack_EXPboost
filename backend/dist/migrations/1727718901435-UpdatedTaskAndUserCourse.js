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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatedTaskAndUserCourse1727718901435 = void 0;
class UpdatedTaskAndUserCourse1727718901435 {
    constructor() {
        this.name = 'UpdatedTaskAndUserCourse1727718901435';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "Tasks" ADD "completeCondition" character varying NOT NULL`);
            yield queryRunner.query(`ALTER TABLE "UserCourses" ADD "parsedData" jsonb`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "UserCourses" DROP COLUMN "parsedData"`);
            yield queryRunner.query(`ALTER TABLE "Tasks" DROP COLUMN "completeCondition"`);
        });
    }
}
exports.UpdatedTaskAndUserCourse1727718901435 = UpdatedTaskAndUserCourse1727718901435;
