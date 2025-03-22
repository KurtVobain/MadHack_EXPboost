import { MigrationInterface, QueryRunner } from "typeorm";

export class CheckProgressAdj1727810856052 implements MigrationInterface {
    name = 'CheckProgressAdj1727810856052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Awards" ("id" SERIAL NOT NULL, "nftId" character varying, "amount" integer, "userBattlePassId" integer, CONSTRAINT "PK_8e619b7e81fa1ccd3ea5fee0893" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "UserBattlePass" ADD "levelClosed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "walletAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "Awards" ADD CONSTRAINT "FK_4633442979dc538bfea854a7f63" FOREIGN KEY ("userBattlePassId") REFERENCES "BattlePass"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Awards" DROP CONSTRAINT "FK_4633442979dc538bfea854a7f63"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "walletAddress"`);
        await queryRunner.query(`ALTER TABLE "UserBattlePass" DROP COLUMN "levelClosed"`);
        await queryRunner.query(`DROP TABLE "Awards"`);
    }

}
