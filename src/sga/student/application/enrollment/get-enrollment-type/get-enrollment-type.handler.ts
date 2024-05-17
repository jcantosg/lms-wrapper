import { QueryEmptyHandler } from '#shared/domain/bus/query.empty.handler';
import {
  EnrollmentTypeEnum,
  getAllEnrollmentTypes,
} from '#student/domain/enum/enrollment/enrollment-type.enum';

export class GetEnrollmentTypeHandler implements QueryEmptyHandler {
  async handle(): Promise<EnrollmentTypeEnum[]> {
    return getAllEnrollmentTypes();
  }
}
