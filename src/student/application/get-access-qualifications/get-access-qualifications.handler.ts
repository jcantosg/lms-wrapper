import { QueryEmptyHandler } from '#shared/domain/bus/query.empty.handler';
import {
  AccessQualification,
  getAccessQualification,
} from '#/student/domain/enum/access-qualification.enum';

export class GetAccessQualificationsHandler implements QueryEmptyHandler {
  async handle(): Promise<AccessQualification[]> {
    return getAccessQualification();
  }
}