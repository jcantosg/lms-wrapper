import { Query } from '#shared/domain/bus/query';

export interface QueryHandler {
  handle(query: Query): any;
}
