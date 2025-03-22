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
exports.UpdatedUser1727814216044 = void 0;
class UpdatedUser1727814216044 {
    constructor() {
        this.name = 'UpdatedUser1727814216044';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "Users" ADD "balance" integer NOT NULL DEFAULT '0'`);
            yield queryRunner.query(`ALTER TABLE "Users" ADD "isPremium" boolean NOT NULL DEFAULT false`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "isPremium"`);
            yield queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "balance"`);
        });
    }
}
exports.UpdatedUser1727814216044 = UpdatedUser1727814216044;
