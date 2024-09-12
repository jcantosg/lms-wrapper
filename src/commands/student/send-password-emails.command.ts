import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '#/app.module';
import datasource from '#config/ormconfig';
import { Student } from '#shared/domain/entity/student.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import {
  parseAddress,
  parseEmail,
} from '#shared/domain/lib/business-unit-info-parser';
import readline from 'readline';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { emails } from '#commands/student/emails-sent';

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const mailer = await app.resolve(MailerService);
  const studentRepository = datasource.getRepository(Student);
  const businessUnitRepository = datasource.getRepository(BusinessUnit);
  const logger = new Logger('Send New Students Password by Email');
  app.useLogger(logger);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    'Introduzca el código de la unidad de negocio: ',
    async function (response) {
      if (
        !(await businessUnitRepository.exist({
          where: { code: response },
        }))
      ) {
        logger.verbose('La unidad de negocio no existe.');
        rl.close();
        await app.close();

        return;
      }

      const rawStudents: Student[] = await studentRepository.find({
        where: {
          academicRecords: {
            businessUnit: { code: response },
            status: AcademicRecordStatusEnum.VALID,
          },
          isActive: true,
        },
        relations: { academicRecords: { businessUnit: true } },
      });

      const students = rawStudents.filter((st) => !emails.includes(st.email));

      logger.verbose(`Enviando emails a ${students.length} alumnos...`);

      let sleeper: number = 0;
      for (const student of students) {
        if (!student.identityDocument) {
          logger.error(
            `Error con el alumno ${student.id}: Documento de identidad inválido.`,
          );
          continue;
        }
        if (student.academicRecords.length === 0) {
          logger.error(
            `Error con el alumno ${student.id}: Ningún expediente activo en ${response} para este estudiante.`,
          );
          continue;
        }

        try {
          await mailer.sendMail({
            to: student.email,
            template: './new-student-credentials',
            subject: 'Bienvenid@ a UNIVERSAE',
            context: {
              studentName: student.name,
              universaeEmail: student.universaeEmail,
              password: `universae@${student.identityDocument.identityDocumentNumber}`,
              businessUnitEmail: parseEmail(
                student.academicRecords[0].businessUnit,
              ),
              businessUnitAddress: parseAddress(
                student.academicRecords[0].businessUnit,
              ),
            },
          });
          logger.verbose(`Credenciales enviadas a ${student.email}`);
        } catch (e) {
          logger.error(`error sending credentials to ${student.email}`);
        }

        if (sleeper === 10) {
          await sleep(1000);
          sleeper = 0;
        }
        sleeper++;
      }
      logger.verbose(`Todos los emails enviados.`);

      rl.close();
      await app.close();
    },
  );
}

bootstrap();
