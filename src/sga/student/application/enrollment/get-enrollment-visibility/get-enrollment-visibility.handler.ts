import { QueryEmptyHandler } from '#shared/domain/bus/query.empty.handler';
import {
  EnrollmentVisibilityEnum,
  getAllEnrollmentVisibilities,
} from '#student/domain/enum/enrollment/enrollment-visibility.enum';

export class GetEnrollmentVisibilityHandler implements QueryEmptyHandler {
  async handle(): Promise<EnrollmentVisibilityEnum[]> {
    return getAllEnrollmentVisibilities();
  }
}
