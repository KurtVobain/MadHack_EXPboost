import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedTaskAndUserCourse1727718901435 implements MigrationInterface {
    name = 'UpdatedTaskAndUserCourse1727718901435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Tasks" ADD "completeCondition" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "UserCourses" ADD "parsedData" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserCourses" DROP COLUMN "parsedData"`);
        await queryRunner.query(`ALTER TABLE "Tasks" DROP COLUMN "completeCondition"`);
    }

}
