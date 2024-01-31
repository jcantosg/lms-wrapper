import { Criteria, GroupOperator } from '#/sga/shared/domain/criteria/criteria';
import { Brackets, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { FilterOperators } from '#/sga/shared/domain/criteria/filter';

export class TypeOrmRepository<T extends ObjectLiteral> {
  async convertCriteriaToQueryBuilder(
    adminUserBusinessUnits: string[],
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<T>,
    aliasQuery: string,
    filterUserAliasQuery: string,
  ): Promise<TypeOrmRepository<T>> {
    return this.applyFilters(criteria, queryBuilder, aliasQuery)
      .filterUser(queryBuilder, adminUserBusinessUnits, filterUserAliasQuery)
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .applyPagination(criteria, queryBuilder);
  }

  private applyFilters(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<T>,
    aliasQuery: string,
  ): TypeOrmRepository<T> {
    const whereMethod =
      criteria.groupOperator === GroupOperator.AND ? 'andWhere' : 'orWhere';

    queryBuilder.where(
      new Brackets((qb) => {
        criteria.filters.forEach((filter) => {
          const fieldPath = filter.relationPath
            ? `${filter.relationPath}.${filter.field}`
            : `${aliasQuery}.${filter.field}`;

          const paramName = filter.field;
          if (filter.operator === FilterOperators.LIKE) {
            qb[whereMethod](
              `LOWER(${fieldPath}) ${filter.operator} LOWER(:${paramName})`,
              {
                [paramName]: `%${filter.value}%`,
              },
            );
          } else {
            qb[whereMethod](`${fieldPath} ${filter.operator} :${paramName}`, {
              [paramName]: filter.value,
            });
          }
        });
      }),
    );

    return this;
  }

  private filterUser(
    queryBuilder: SelectQueryBuilder<T>,
    adminUserBusinessUnits: string[],
    aliasQuery: string,
  ): TypeOrmRepository<T> {
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

  async getCount(queryBuilder: SelectQueryBuilder<T>): Promise<number> {
    return await queryBuilder.getCount();
  }

  private applyOrder(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<T>,
    aliasQuery: string,
  ): TypeOrmRepository<T> {
    if (criteria.order.hasOrderType() && criteria.order.hasOrderBy()) {
      const orderBy =
        criteria.order.orderBy === 'country'
          ? 'country.name'
          : `${aliasQuery}.${criteria.order.orderBy}`;
      queryBuilder.addOrderBy(
        orderBy,
        criteria.order.orderType === OrderTypes.NONE
          ? undefined
          : criteria.order.orderType,
      );
    }

    return this;
  }

  private applyPagination(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<T>,
  ): TypeOrmRepository<T> {
    queryBuilder
      .skip((criteria.page - 1) * criteria.limit)
      .take(criteria.limit);

    return this;
  }

  protected normalizeAdminUserBusinessUnits(businessUnits: string[]): string[] {
    if (businessUnits.length === 0) {
      businessUnits.push('empty');
    }

    return businessUnits;
  }
}
