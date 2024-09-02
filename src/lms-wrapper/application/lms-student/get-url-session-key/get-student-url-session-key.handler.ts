import { QueryHandler } from '#shared/domain/bus/query.handler';
import { LmsStudentRepository } from '#lms-wrapper/domain/repository/lms-student.repository';
import { GetStudentUrlSessionKeyQuery } from '#lms-wrapper/application/lms-student/get-url-session-key/get-student-url-session-key.query';
import { LmsStudentNotInStudentException } from '#lms-wrapper/domain/exception/lms-student-not-in-student.exception';

export class GetStudentUrlSessionKeyHandler implements QueryHandler {
  constructor(private readonly lmsStudentRepository: LmsStudentRepository) {}

  async handle(query: GetStudentUrlSessionKeyQuery): Promise<string> {
    if (!query.student.lmsStudent) {
      throw new LmsStudentNotInStudentException();
    }

    return await this.lmsStudentRepository.getUserSessionKeyUrl(
      query.student.lmsStudent,
    );
  }
}
