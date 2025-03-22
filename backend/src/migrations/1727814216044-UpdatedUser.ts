import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedUser1727814216044 implements MigrationInterface {
    name = 'UpdatedUser1727814216044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "balance" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "isPremium" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "isPremium"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "balance"`);
    }

}
