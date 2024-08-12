import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { SearchCommunicationsQuery } from '#shared/application/communication/search-communications/search-communications.query';
import { Order } from '#/sga/shared/domain/criteria/order';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';

export class SearchCommunicationsCriteria extends Criteria {
  constructor(query: SearchCommunicationsQuery) {
    super(
      SearchCommunicationsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  static createFilters(query: SearchCommunicationsQuery): Filter[] {
    return [
      new Filter(
        'subject',
        query.subjectText,
        FilterOperators.LIKE,
        GroupOperator.OR,
      ),
    ];
  }
}
