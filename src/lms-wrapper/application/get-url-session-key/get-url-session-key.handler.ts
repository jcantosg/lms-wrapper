import { QueryHandler } from '#shared/domain/bus/query.handler';
import { LmsStudentRepository } from '#lms-wrapper/domain/repository/lms-student.repository';
import { GetUrlSessionKeyQuery } from '#lms-wrapper/application/get-url-session-key/get-url-session-key.query';
import { LmsStudentNotInStudentException } from '#lms-wrapper/domain/exception/lms-student-not-in-student.exception';

export class GetUrlSessionKeyHandler implements QueryHandler {
  constructor(private readonly lmsStudentRepository: LmsStudentRepository) {}

  async handle(query: GetUrlSessionKeyQuery): Promise<string> {
    if (!query.student.lmsStudent) {
      throw new LmsStudentNotInStudentException();
    }

    return await this.lmsStudentRepository.getUserSessionKeyUrl(
      query.student.lmsStudent,
    );
  }
}
