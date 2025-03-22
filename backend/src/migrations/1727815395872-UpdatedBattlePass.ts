import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedBattlePass1727815395872 implements MigrationInterface {
    name = 'UpdatedBattlePass1727815395872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "BattlePass" ADD "isPremium" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "BattlePass" DROP COLUMN "isPremium"`);
    }

}
