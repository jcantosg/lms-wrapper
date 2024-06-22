import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import {
  Brackets,
  ObjectLiteral,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import {
  Filter,
  FilterOperators,
  GroupOperator,
} from '#/sga/shared/domain/criteria/filter';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

const fieldOrderByMapping: Record<string, string> = {
  country: 'country.name',
  title: 'title.name',
  businessUnit: 'business_unit.name',
  officialCode: 'title.officialCode',
  subjectOfficialCode: 'subjects.officialCode',
  identityDocumentNumber: `"student".identity_document->>'identityDocumentNumber'`,
  subjectName: 'subject.name',
  programBlock: 'programBlock.name',
  callDate: 'subjectCall.callDate',
  finalGrade: 'subjectCall.finalGrade',
  status: 'subjectCall.status',
  academicProgram: 'academic_program.name',
  academicPeriod: 'academic_period.name',
  academicYear: 'period_block.academicYear',
  startMonth: 'period_block.startMonth',
  blockName: 'period_block.name',
  startDate: 'period_block.startDate',
};

export class TypeOrmRepository<T extends ObjectLiteral> {
  async convertCriteriaToQueryBuilder(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<T>,
    aliasQuery: string,
  ): Promise<TypeOrmRepository<T>> {
    return this.applyFilters(criteria, queryBuilder, aliasQuery);
  }

  async filterBusinessUnits(
    queryBuilder: SelectQueryBuilder<T>,
    relationType: string,
    adminUserBusinessUnits?: BusinessUnit[],
  ): Promise<TypeOrmRepository<T>> {
    if (adminUserBusinessUnits && adminUserBusinessUnits.length > 0) {
      queryBuilder.andWhere(
        `"${
          relationType === 'oneToMany' ? 'business_unit' : 'business_units'
        }"."id" IN(:...businessUnits)`,
        {
          businessUnits: adminUserBusinessUnits.map(
            (bu: BusinessUnit) => bu.id,
          ),
        },
      );
    }

    return this;
  }

  private async applyFilters(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<T>,
    aliasQuery: string,
  ): Promise<TypeOrmRepository<T>> {
    if (
      criteria.filters.some(
        (filter) => filter.groupOperator === GroupOperator.OR,
      )
    ) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          this.applyGroupFilters(
            criteria.filters.filter(
              (filter) => filter.groupOperator === GroupOperator.OR,
            ),
            GroupOperator.OR,
            qb,
            aliasQuery,
          );
        }),
      );
    }

    await this.applyGroupFilters(
      criteria.filters.filter(
        (filter) => filter.groupOperator === GroupOperator.AND,
      ),
      GroupOperator.AND,
      queryBuilder,
      aliasQuery,
    );

    return this;
  }

  private async applyGroupFilters(
    filters: Filter[],
    groupOperator: GroupOperator,
    queryBuilder: SelectQueryBuilder<T> | WhereExpressionBuilder,
    aliasQuery: string,
  ): Promise<void> {
    for (const filter of filters) {
      const fieldPath = this.getFieldPath(filter, aliasQuery, filter.value);
      const paramName = this.getParamName(filter);
      const parameter = this.getParameter(filter);

      switch (filter.operator) {
        case FilterOperators.LIKE:
          this.addWhereCondition(
            queryBuilder,
            `unaccent(LOWER(cast(${fieldPath} as text))) LIKE unaccent(LOWER(:${paramName}))`,
            parameter,
            groupOperator,
          );
          break;
        case FilterOperators.ANY:
          this.addWhereCondition(
            queryBuilder,
            `:${paramName} = ANY(${fieldPath})`,
            parameter,
            groupOperator,
          );
          break;
        case FilterOperators.JSON_VALUE:
          this.addWhereCondition(
            queryBuilder,
            `${fieldPath} ${filter.operator} '${filter.relationObject}' LIKE  '%' || :${paramName} || '%'`,
            parameter,
            groupOperator,
          );
          break;
        default:
          this.addWhereCondition(
            queryBuilder,
            `${fieldPath} ${filter.operator} :${paramName}`,
            parameter,
            groupOperator,
          );
          break;
      }
    }
  }

  private getFieldPath(
    filter: Filter,
    aliasQuery: string,
    filterValue: any,
  ): string {
    let path = filter.relationPath
      ? `${filter.relationPath}.${filter.field}`
      : `${aliasQuery}.${filter.field}`;

    if (filterValue instanceof Date) {
      path = `DATE(${path})`;
    }

    return path;
  }

  private getParamName(filter: Filter): string {
    return filter.relationPath
      ? `${filter.relationPath}_${filter.field}`
      : filter.field;
  }

  private getParameter(filter: Filter): Object {
    const paramName = this.getParamName(filter);

    return {
      [paramName]:
        filter.operator === FilterOperators.LIKE
          ? `%${filter.value}%`
          : filter.value,
    };
  }

  private addWhereCondition(
    queryBuilder: SelectQueryBuilder<T> | WhereExpressionBuilder,
    condition: string,
    parameter: Object,
    groupOperator: GroupOperator,
  ): void {
    groupOperator === GroupOperator.AND
      ? queryBuilder.andWhere(condition, parameter)
      : queryBuilder.orWhere(condition, parameter);
  }

  filterUser(
    queryBuilder: SelectQueryBuilder<T>,
    adminUserBusinessUnits: string[] | null,
    aliasQuery: string,
  ): TypeOrmRepository<T> {
    if (!adminUserBusinessUnits) {
      return this;
    }
    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );

    queryBuilder.andWhere(`${aliasQuery}.id ${FilterOperators.IN}(:...ids)`, {
      ids: adminUserBusinessUnits,
    });

    return this;
  }

  async getMany(queryBuilder: SelectQueryBuilder<T>): Promise<T[]> {
    return await queryBuilder.getMany();
  }

  async getRawMany(queryBuilder: SelectQueryBuilder<T>) {
    return await queryBuilder.getRawMany();
  }

  async getCount(queryBuilder: SelectQueryBuilder<T>): Promise<number> {
    return await queryBuilder.getCount();
  }

  applyOrder(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<T>,
    aliasQuery: string,
    orderByJsonField: boolean = false,
  ): TypeOrmRepository<T> {
    if (criteria.order!.hasOrderType() && criteria.order!.hasOrderBy()) {
      const orderByField = criteria.order!.orderBy;
      const orderBy = !criteria.order!.hasOrderNested()
        ? fieldOrderByMapping[orderByField] || `${aliasQuery}.${orderByField}`
        : fieldOrderByMapping[orderByField] || `${orderByField}`;

      if (orderByJsonField) {
        queryBuilder.select([`${aliasQuery}.id`, orderBy]);
        queryBuilder.distinct(true);
      }

      queryBuilder.addOrderBy(
        orderBy,
        criteria.order!.orderType === OrderTypes.NONE
          ? undefined
          : criteria.order!.orderType,
      );
    }

    return this;
  }

  applyPagination(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<T>,
  ): TypeOrmRepository<T> {
    queryBuilder
      .skip((criteria.page! - 1) * criteria.limit!)
      .take(criteria.limit!);

    return this;
  }

  applyPaginationWithLimit(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<T>,
  ): TypeOrmRepository<T> {
    queryBuilder
      .offset((criteria.page! - 1) * criteria.limit!)
      .limit(criteria.limit!);

    return this;
  }

  protected normalizeAdminUserBusinessUnits(businessUnits: string[]): string[] {
    if (businessUnits.length === 0) {
      businessUnits.push('empty');
    }

    return businessUnits;
  }
}
