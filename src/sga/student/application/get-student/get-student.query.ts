import { Query } from '#shared/domain/bus/query';

export class GetStudentQuery implements Query {
  constructor(public readonly id: string) {}
}
