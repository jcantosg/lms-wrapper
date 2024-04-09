import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetAllSubjectsQuery } from '#academic-offering/applicaton/subject/get-all-subjects/get-all-subjects.query';

export class GetAllSubjectsCriteria extends Criteria {
  constructor(query: GetAllSubjectsQuery) {
    super(
      GetAllSubjectsCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
      query.page,
      query.limit,
    );
  }

  private static createFilters(query: GetAllSubjectsQuery): Filter[] {
    return [
      new Filter('name', query.name, FilterOperators.LIKE, GroupOperator.AND),
      new Filter('code', query.code, FilterOperators.LIKE, GroupOperator.AND),
      new Filter(
        'officialCode',
        query.officialCode,
        FilterOperators.LIKE,
        GroupOperator.AND,
      ),
      new Filter(
        'modality',
        query.modality,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
      new Filter(
        'id',
        query.evaluationType,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'evaluation_type',
      ),
      new Filter('type', query.type, FilterOperators.EQUALS, GroupOperator.AND),
      new Filter(
        'name',
        query.businessUnit,
        FilterOperators.LIKE,
        GroupOperator.AND,
        'business_unit',
      ),
      new Filter(
        'isRegulated',
        query.isRegulated,
        FilterOperators.EQUALS,
        GroupOperator.AND,
      ),
    ].filter((filter) => filter.value !== undefined);
  }
}
