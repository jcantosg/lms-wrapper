import { MoodleWrapper } from '#/lms-wrapper/infrastructure/wrapper/moodle-wrapper';
import { LmsStudentRepository } from '#/lms-wrapper/domain/repository/lms-student.repository';
import { LmsStudent } from '#/lms-wrapper/domain/entity/lms-student';
import { MoodleGetUserResponse } from '#lms-wrapper/infrastructure/wrapper/moodle-responses';

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

  async getByEmail(
    universaeEmail: string,
    personalEmail: string,
  ): Promise<LmsStudent | null> {
    const rawLmsStudent: MoodleGetUserResponse | null =
      await this.moodleWrapper.getStudentByEmail(universaeEmail, personalEmail);

    return rawLmsStudent
      ? new LmsStudent({
          id: rawLmsStudent.id,
          username: rawLmsStudent.username,
          firstName: rawLmsStudent.firstname,
          lastName: rawLmsStudent.lastname,
          email: rawLmsStudent.email,
          password: '',
        })
      : null;
  }

  async delete(id: number): Promise<void> {
    await this.moodleWrapper.deleteStudent(id);
  }

  async getUserSessionKeyUrl(lmsStudent: LmsStudent): Promise<string> {
    return await this.moodleWrapper.getUrlWithSessionKey(
      lmsStudent.value.email,
    );
  }
}
