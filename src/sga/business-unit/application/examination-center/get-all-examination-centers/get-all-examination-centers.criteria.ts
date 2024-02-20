import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetAllExaminationCentersQuery } from '#business-unit/application/examination-center/get-all-examination-centers/get-all-examination-centers.query';

export class GetAllExaminationCentersCriteria extends Criteria {
  constructor(query: GetAllExaminationCentersQuery) {
    super(
      GetAllExaminationCentersCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: GetAllExaminationCentersQuery): Filter[] {
    return [
      new Filter('name', query.name, FilterOperators.LIKE, GroupOperator.AND),
      new Filter('code', query.code, FilterOperators.LIKE, GroupOperator.AND),
      new Filter(
        'isActive',
        query.isActive,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
      new Filter(
        'country',
        query.country,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
      new Filter(
        'address',
        query.address,
        FilterOperators.LIKE,
        GroupOperator.AND,
      ),
      new Filter(
        'name',
        query.businessUnits,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'business_units',
      ),
      new Filter(
        'name',
        query.classrooms,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'classrooms',
      ),
    ].filter((filter) => filter.value !== undefined);
  }
}
