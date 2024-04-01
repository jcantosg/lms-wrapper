import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order, OrderTypes } from '#/sga/shared/domain/criteria/order';

export class GetAcademicProgramsByBusinessUnitCriteria extends Criteria {
  constructor(businessUnitId: string) {
    super(
      [
        new Filter(
          'id',
          businessUnitId,
          FilterOperators.EQUALS,
          GroupOperator.AND,
          'business_unit',
        ),
      ],
      new Order('id', OrderTypes.NONE),
      1,
      200,
    );
  }
}
