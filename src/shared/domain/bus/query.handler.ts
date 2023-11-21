import { Query } from './query';

export interface QueryHandler {
  handle(query: Query): any;
}
