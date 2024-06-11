import { MoodleWrapper } from '#/lms-wrapper/infrastructure/wrapper/moodle-wrapper';
import { LmsStudentRepository } from '#/lms-wrapper/domain/repository/lms-student.repository';
import { LmsStudent } from '#/lms-wrapper/domain/entity/lms-student';

export class MoodleStudentRepository implements LmsStudentRepository {
  constructor(private readonly moodleWrapper: MoodleWrapper) {}

  async save(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<LmsStudent> {
    const lmsId = await this.moodleWrapper.saveStudent(
      username,
      firstName,
      lastName,
      email,
      password,
    );

    return new LmsStudent({
      id: lmsId,
      username,
      firstName,
      lastName,
      email,
      password,
    });
  }

  async delete(id: number): Promise<void> {
    await this.moodleWrapper.deleteStudent(id);
  }
}
