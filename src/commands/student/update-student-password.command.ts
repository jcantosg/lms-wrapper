import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '#/app.module';
import datasource from '#config/ormconfig';
import { Student } from '#shared/domain/entity/student.entity';
import { BCryptPasswordEncoder } from '#shared/infrastructure/service/bcrypt-password-encoder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const passwordGenerator = new BCryptPasswordEncoder();
  const studentRepository = datasource.getRepository(Student);
  const logger = new Logger('Send New Students Password by Email');
  app.useLogger(logger);
  const email = process.env.npm_config_email;
  logger.verbose(`Actualizar el usuario con correo ${email}`);

  const student: Student = await studentRepository.findOneOrFail({
    where: {
      universaeEmail: email,
      isActive: true,
    },
  });
  const identityDocumentNumber = student.identityDocument
    ?.identityDocumentNumber
    ? student.identityDocument.identityDocumentNumber
    : '1234';
  const newPassword = `universae@${identityDocumentNumber}`;
  logger.verbose(`La nueva contraseña es ${newPassword}`);
  student.password = await passwordGenerator.encodePassword(newPassword);
  await studentRepository.save({
    id: student.id,
    password: student.password,
  });
  logger.verbose('Contraseña del usuario actualizada');

  await app.close();
}

bootstrap();
