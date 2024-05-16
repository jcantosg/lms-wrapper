import { Query } from '#shared/domain/bus/query';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';

export class GetEnrollmentsByAcademicRecordQuery implements Query {
  constructor(
    public readonly academicRecordId: string,
    public readonly orderBy: string,
    public readonly orderType: OrderTypes,
  ) {}
}
