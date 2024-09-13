import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { GetCommunicationsQuery } from '#shared/application/communication/get-communications/get-communications.query';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';

export class GetCommunicationsCriteria extends Criteria {
  constructor(query: GetCommunicationsQuery) {
    super(
      GetCommunicationsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  static createFilters(query: GetCommunicationsQuery): Filter[] {
    return [
      new Filter(
        'message',
        query.subject,
        FilterOperators.JSON_VALUE,
        GroupOperator.AND,
        undefined,
        'subject',
      ),
      new Filter(
        'name',
        query.sentBy,
        FilterOperators.CONCAT,
        GroupOperator.AND,
        'sentBy',
        null,
        'surname',
      ),
      new Filter(
        'id',
        query.businessUnit,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'businessUnit',
      ),
      new Filter(
        'createdAt',
        query.createdAt,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
      new Filter(
        'sentAt',
        query.sentAt,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
      new Filter(
        'status',
        query.status,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
    ].filter((filter) => {
      return filter.value !== undefined;
    });
  }
}
