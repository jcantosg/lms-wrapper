import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { Order } from '#/sga/shared/domain/criteria/order';
import { GetSubjectsByProgramBlockQuery } from '#academic-offering/applicaton/program-block/get-subjects-by-program-block/get-subjects-by-program-block.query';

export class GetSubjectsByProgramBlockCriteria extends Criteria {
  constructor(query: GetSubjectsByProgramBlockQuery) {
    super(
      GetSubjectsByProgramBlockCriteria.createFilters(query),
      new Order(query.orderBy, query.orderType),
    );
  }

  static createFilters(query: GetSubjectsByProgramBlockQuery) {
    return [
      new Filter(
        'id',
        query.blockId,
        FilterOperators.EQUALS,
        GroupOperator.AND,
        'program_blocks',
      ),
    ];
  }
}
