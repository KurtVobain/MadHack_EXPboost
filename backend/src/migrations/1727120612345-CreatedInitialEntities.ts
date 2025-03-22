import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedInitialEntities1727120612345 implements MigrationInterface {
    name = 'CreatedInitialEntities1727120612345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "UserTasks" ("id" SERIAL NOT NULL, "completed" boolean NOT NULL DEFAULT false, "completedDate" TIMESTAMP, "userId" integer, "taskId" integer, CONSTRAINT "PK_b4a49cb277e2f3956a40368c209" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Tasks" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "text" character varying NOT NULL, "experience" integer NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, CONSTRAINT "PK_f38c2a61ff630a16afca4dac442" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "CourseTasks" ("id" SERIAL NOT NULL, "courseId" integer, "taskId" integer, CONSTRAINT "UQ_5f40c22a6ff1617d07cffb7e84e" UNIQUE ("courseId", "taskId"), CONSTRAINT "PK_6f6c9b1b88010a01059b0c26146" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Courses" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_e01ce00d3984a78d0693ab3ecbe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "UserCourses" ("id" SERIAL NOT NULL, "nickname" character varying NOT NULL, "userId" integer, "courseId" integer, CONSTRAINT "UQ_323c0b809d33e2e81db560379a2" UNIQUE ("userId", "courseId"), CONSTRAINT "PK_3559ccfb540996c2b01bfb6354a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "BattlePass" ("id" SERIAL NOT NULL, "stage" integer NOT NULL, "requiredExperience" integer NOT NULL, "reward" character varying NOT NULL, CONSTRAINT "PK_80ac1f6af8508ada9a81aa42e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "UserBattlePass" ("id" SERIAL NOT NULL, "progress" integer NOT NULL DEFAULT '0', "userId" integer, "battlePassId" integer, CONSTRAINT "PK_067deb4a42d1bb66aff3f639cfd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "profileLevel" integer NOT NULL DEFAULT '0', "experience" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "UserTasks" ADD CONSTRAINT "FK_f27184d80c2d06cdee3f410036c" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserTasks" ADD CONSTRAINT "FK_ac97c7ae6db6b314bde79f987d8" FOREIGN KEY ("taskId") REFERENCES "Tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CourseTasks" ADD CONSTRAINT "FK_89a07e1bba1501fe038f2aa7436" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CourseTasks" ADD CONSTRAINT "FK_8414fdbb652b9bd2e0f79c7a4b9" FOREIGN KEY ("taskId") REFERENCES "Tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserCourses" ADD CONSTRAINT "FK_0a46a9add504794362fa438e375" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserCourses" ADD CONSTRAINT "FK_f772027da60313c6a8089f17432" FOREIGN KEY ("courseId") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserBattlePass" ADD CONSTRAINT "FK_afede572462f063d0ca0ff8f81c" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserBattlePass" ADD CONSTRAINT "FK_215b4acf3fd792e1dd9fb1b8c2b" FOREIGN KEY ("battlePassId") REFERENCES "BattlePass"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserBattlePass" DROP CONSTRAINT "FK_215b4acf3fd792e1dd9fb1b8c2b"`);
        await queryRunner.query(`ALTER TABLE "UserBattlePass" DROP CONSTRAINT "FK_afede572462f063d0ca0ff8f81c"`);
        await queryRunner.query(`ALTER TABLE "UserCourses" DROP CONSTRAINT "FK_f772027da60313c6a8089f17432"`);
        await queryRunner.query(`ALTER TABLE "UserCourses" DROP CONSTRAINT "FK_0a46a9add504794362fa438e375"`);
        await queryRunner.query(`ALTER TABLE "CourseTasks" DROP CONSTRAINT "FK_8414fdbb652b9bd2e0f79c7a4b9"`);
        await queryRunner.query(`ALTER TABLE "CourseTasks" DROP CONSTRAINT "FK_89a07e1bba1501fe038f2aa7436"`);
        await queryRunner.query(`ALTER TABLE "UserTasks" DROP CONSTRAINT "FK_ac97c7ae6db6b314bde79f987d8"`);
        await queryRunner.query(`ALTER TABLE "UserTasks" DROP CONSTRAINT "FK_f27184d80c2d06cdee3f410036c"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "UserBattlePass"`);
        await queryRunner.query(`DROP TABLE "BattlePass"`);
        await queryRunner.query(`DROP TABLE "UserCourses"`);
        await queryRunner.query(`DROP TABLE "Courses"`);
        await queryRunner.query(`DROP TABLE "CourseTasks"`);
        await queryRunner.query(`DROP TABLE "Tasks"`);
        await queryRunner.query(`DROP TABLE "UserTasks"`);
    }

}
