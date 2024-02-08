import { Criteria, GroupOperator } from '#/sga/shared/domain/criteria/criteria';
import { Filter, FilterOperators } from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetAllExaminationCentersQuery } from '#business-unit/application/examination-center/get-all-examination-centers/get-all-examination-centers.query';

export class GetAllExaminationCentersCriteria extends Criteria {
  constructor(query: GetAllExaminationCentersQuery) {
    super(
      GetAllExaminationCentersCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      GroupOperator.AND,
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: GetAllExaminationCentersQuery): Filter[] {
    return [
      new Filter('name', query.name, FilterOperators.LIKE),
      new Filter('code', query.code, FilterOperators.LIKE),
      new Filter('isActive', query.isActive),
      new Filter('country', query.country),
      new Filter('address', query.address, FilterOperators.LIKE),
      new Filter(
        'name',
        query.businessUnits,
        FilterOperators.LIKE,
        'businessUnits',
      ),
      new Filter('name', query.classrooms, FilterOperators.LIKE, 'classrooms'),
    ].filter((filter) => filter.value !== undefined);
  }
}
