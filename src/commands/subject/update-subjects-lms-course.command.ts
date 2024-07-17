import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { MoodleCourseRepository } from '#lms-wrapper/infrastructure/repository/moodle-course.repository';
import { MoodleWrapper } from '#lms-wrapper/infrastructure/wrapper/moodle-wrapper';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '#/app.module';
import { FetchWrapper } from '#shared/infrastructure/clients/fetch-wrapper';
import { Logger } from '@nestjs/common';
import datasource from '#config/ormconfig';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const subjectRepository = datasource.getRepository(Subject);
  const configService = await app.resolve(ConfigService);

  const lmsCourseRepository = new MoodleCourseRepository(
    new MoodleWrapper(
      new FetchWrapper(configService.getOrThrow('LMS_URL'), new Logger()),
      configService.getOrThrow('LMS_TOKEN'),
    ),
  );
  const subjects = await subjectRepository.find();
  for (const subject of subjects) {
    subject.lmsCourse = await lmsCourseRepository.getByName(subject.code);
    await subjectRepository.save({
      id: subject.id,
      lmsCourse: subject.lmsCourse,
    });
  }

  await app.close();
}

bootstrap();
