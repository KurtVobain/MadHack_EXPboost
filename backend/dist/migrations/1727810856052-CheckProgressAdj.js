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
exports.CheckProgressAdj1727810856052 = void 0;
class CheckProgressAdj1727810856052 {
    constructor() {
        this.name = 'CheckProgressAdj1727810856052';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`CREATE TABLE "Awards" ("id" SERIAL NOT NULL, "nftId" character varying, "amount" integer, "userBattlePassId" integer, CONSTRAINT "PK_8e619b7e81fa1ccd3ea5fee0893" PRIMARY KEY ("id"))`);
            yield queryRunner.query(`ALTER TABLE "UserBattlePass" ADD "levelClosed" boolean NOT NULL DEFAULT false`);
            yield queryRunner.query(`ALTER TABLE "Users" ADD "walletAddress" character varying`);
            yield queryRunner.query(`ALTER TABLE "Awards" ADD CONSTRAINT "FK_4633442979dc538bfea854a7f63" FOREIGN KEY ("userBattlePassId") REFERENCES "BattlePass"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`ALTER TABLE "Awards" DROP CONSTRAINT "FK_4633442979dc538bfea854a7f63"`);
            yield queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "walletAddress"`);
            yield queryRunner.query(`ALTER TABLE "UserBattlePass" DROP COLUMN "levelClosed"`);
            yield queryRunner.query(`DROP TABLE "Awards"`);
        });
    }
}
exports.CheckProgressAdj1727810856052 = CheckProgressAdj1727810856052;
