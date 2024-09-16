import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { MoodleCourseRepository } from '#lms-wrapper/infrastructure/repository/moodle-course.repository';
import { MoodleWrapper } from '#lms-wrapper/infrastructure/wrapper/moodle-wrapper';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '#/app.module';
import { FetchWrapper } from '#shared/infrastructure/clients/fetch-wrapper';
import { Logger } from '@nestjs/common';
import datasource from '#config/ormconfig';
import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { LmsCourse } from '#lms-wrapper/domain/entity/lms-course';
import { LmsCourseCategoryEnum } from '#lms-wrapper/domain/enum/lms-course-category.enum';

function getCategory(modality: SubjectModality) {
  switch (modality) {
    case SubjectModality.PRESENCIAL:
      return 1445;
    case SubjectModality.MIXED:
      return 1444;
    case SubjectModality.ELEARNING:
      return 1443;
    default:
      return 1;
  }
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const subjectRepository = datasource.getRepository(Subject);
  const configService = await app.resolve(ConfigService);
  const logger = new Logger('Mapping subjects from lms');

  const lmsCourseRepository = new MoodleCourseRepository(
    new MoodleWrapper(
      new FetchWrapper(configService.getOrThrow('LMS_URL'), new Logger()),
      configService.getOrThrow('LMS_TOKEN'),
    ),
  );
  const subjects = await subjectRepository.find({
    where: {
      businessUnit: {
        code: 'MADRID',
      },
    },
    relations: {
      businessUnit: true,
    },
  });

  logger.log(`Found ${subjects.length} subjects`);
  let index = 1;

  for (const subject of subjects) {
    let searchCode = subject.code;

    if (!subject.name.startsWith('Información académica')) {
      if (searchCode.startsWith('OLD-')) {
        searchCode = searchCode.replace('OLD-', '');
      }
    }

    logger.log(
      `${index} - Searching LMS course for subject, originalCode ${subject.code} searchCode ${searchCode}`,
    );

    subject.lmsCourse = await lmsCourseRepository.getByName(
      searchCode,
      subject.isSpecialitySubject(),
    );

    if (subject.lmsCourse) {
      logger.log(
        `${index} Found LMS course for subject ${subject.code} ${searchCode}`,
      );

      await subjectRepository.save({
        id: subject.id,
        lmsCourse: subject.lmsCourse,
      });
      logger.log(`${index} updating subject ${subject.code} with LMS course`);
    } else {
      const lmsCourse = new LmsCourse({
        id: 1,
        name: subject.name,
        categoryId: getCategory(subject.modality) as LmsCourseCategoryEnum,
        shortname: searchCode,
        progress: 0,
        modules: [],
      });
      await lmsCourseRepository.save(lmsCourse);
      logger.log(`${index} Created LMS course for subject ${subject.code}`);
      subject.lmsCourse = await lmsCourseRepository.getByName(
        searchCode,
        subject.isSpecialitySubject(),
      );

      await subjectRepository.save({
        id: subject.id,
        lmsCourse: subject.lmsCourse,
      });
      logger.log(
        `${index} updating subject ${subject.code} ${searchCode} with LMS course`,
      );
    }
    index++;
  }

  await app.close();
}

bootstrap();
