import { LmsTeacherRepository } from '#lms-wrapper/domain/repository/lms-teacher.repository';
import { MoodleWrapper } from '#lms-wrapper/infrastructure/wrapper/moodle-wrapper';

export class MoodleTeacherRepository implements LmsTeacherRepository {
  constructor(private readonly moodleWrapper: MoodleWrapper) {}

  async getUserSessionKeyUrl(lmsTeacherEmail: string): Promise<string> {
    return await this.moodleWrapper.getUrlWithSessionKey(lmsTeacherEmail);
  }
}
