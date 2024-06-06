import { LmsWrapper } from '#/lms-wrapper/domain/service/lms-wrapper';
import { ConfigService } from '@nestjs/config';
import { MoodleWrapper } from '#/lms-wrapper/infrastructure/wrapper/moodle-wrapper';
import { FetchWrapper } from '#shared/infrastructure/clients/fetch-wrapper';
import { Logger } from '@nestjs/common';

const moodleWrapper = {
  provide: LmsWrapper,
  useFactory: (configService: ConfigService) => {
    return new MoodleWrapper(
      new FetchWrapper(configService.getOrThrow('LMS_URL'), new Logger()),
      configService.getOrThrow('LMS_TOKEN'),
    );
  },
  inject: [ConfigService],
};

export const services = [moodleWrapper];
