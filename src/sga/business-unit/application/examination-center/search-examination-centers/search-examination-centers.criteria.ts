import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { SearchExaminationCentersQuery } from '#business-unit/application/examination-center/search-examination-centers/search-examination-centers.query';

export class SearchExaminationCentersCriteria extends Criteria {
  constructor(query: SearchExaminationCentersQuery) {
    super(
      SearchExaminationCentersCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: SearchExaminationCentersQuery): Filter[] {
    return [
      new Filter('name', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter('code', query.text, FilterOperators.LIKE, GroupOperator.OR),
      new Filter(
        'name',
        query.text,
        FilterOperators.LIKE,
        GroupOperator.OR,
        'country',
      ),
    ];
  }
}
