import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { SearchAdministrativeProcessesQuery } from '#student/application/administrative-process/search-administrative-processes/search-administrative-processes.query';

export class SearchAdministrativeProcessesCriteria extends Criteria {
  constructor(query: SearchAdministrativeProcessesQuery) {
    super(
      SearchAdministrativeProcessesCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  static createFilters(query: SearchAdministrativeProcessesQuery): Filter[] {
    return [
      new Filter(
        'name',
        query.text,
        FilterOperators.CONCAT,
        GroupOperator.OR,
        'student',
        null,
        'surname',
      ),
    ].filter((filter) => filter.value !== undefined);
  }
}
