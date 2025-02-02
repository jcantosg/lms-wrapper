import { QueryHandler } from '#shared/domain/bus/query.handler';
import { GetEdaeUserUrlSessionKeyQuery } from '#lms-wrapper/application/lms-teacher/get-url-session-key/get-edae-user-url-session-key.query';
import { LmsTeacherRepository } from '#lms-wrapper/domain/repository/lms-teacher.repository';

export class GetEdaeUserUrlSessionKeyHandler implements QueryHandler {
  constructor(
    private readonly lmsTeacherRepository: LmsTeacherRepository,
    private lmsTeacherUrl: string,
  ) {}

  async handle(query: GetEdaeUserUrlSessionKeyQuery): Promise<string> {
    const urlSessionKey = await this.lmsTeacherRepository.getUserSessionKeyUrl(
      query.edaeUser.email,
    );

    return `${urlSessionKey}${this.lmsTeacherUrl}`;
  }
}
