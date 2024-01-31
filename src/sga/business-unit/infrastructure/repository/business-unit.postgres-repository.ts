import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Criteria, GroupOperator } from '#/sga/shared/domain/criteria/criteria';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { FilterOperators } from '#/sga/shared/domain/criteria/filter';

@Injectable()
export class BusinessUnitPostgresRepository implements BusinessUnitRepository {
  constructor(
    @InjectRepository(businessUnitSchema)
    private readonly repository: Repository<BusinessUnit>,
  ) {}

  private normalizeAdminUserBusinessUnits(businessUnits: string[]) {
    if (businessUnits.length === 0) {
      businessUnits.push('empty');
    }

    return businessUnits;
  }

  async save(businessUnit: BusinessUnit): Promise<void> {
    await this.repository.save(businessUnit);
  }

  async getByAdminUser(
    businessUnitId: string,
    adminUserBusinessUnits: string[],
  ): Promise<BusinessUnit | null> {
    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );
    const queryBuilder = this.repository.createQueryBuilder('businessUnit');

    queryBuilder.leftJoinAndSelect('businessUnit.country', 'country');
    queryBuilder.leftJoinAndSelect(
      'businessUnit.virtualCampuses',
      'virtualCampus',
    );
    queryBuilder.leftJoinAndSelect(
      'businessUnit.examinationCenters',
      'examinationCenter',
    );

    queryBuilder.leftJoinAndSelect(
      'examinationCenter.mainBusinessUnit',
      'mainBusinessUnit',
    );

    return await queryBuilder
      .where('businessUnit.id = :id', { id: businessUnitId })
      .andWhere('businessUnit.id IN(:...ids)', {
        ids: adminUserBusinessUnits,
      })
      .getOne();
  }

  async get(id: string): Promise<BusinessUnit | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        country: true,
        virtualCampuses: true,
        examinationCenters: true,
      },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id } });

    return !!result;
  }

  async existsByName(id: string, name: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { name } });

    return result === null ? false : result.id !== id;
  }

  async existsByCode(id: string, code: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { code } });

    return result === null ? false : result.id !== id;
  }

  async count(
    criteria: Criteria,
    adminUserBusinessUnits: string[],
  ): Promise<number> {
    const aliasQuery = 'businessUnit';
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.country`, 'country');

    return this.applyFilters(criteria, queryBuilder, aliasQuery)
      .filterUser(queryBuilder, adminUserBusinessUnits, aliasQuery)
      .getCount(queryBuilder);
  }

  private async getCount(queryBuilder: SelectQueryBuilder<BusinessUnit>) {
    return await queryBuilder.getCount();
  }

  async matching(
    criteria: Criteria,
    adminUserBusinessUnits: string[],
  ): Promise<BusinessUnit[]> {
    const aliasQuery = 'businessUnit';
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.country`, 'country');

    return this.applyFilters(criteria, queryBuilder, aliasQuery)
      .filterUser(queryBuilder, adminUserBusinessUnits, aliasQuery)
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .applyPagination(criteria, queryBuilder)
      .getMany(queryBuilder);
  }

  private async getMany(queryBuilder: SelectQueryBuilder<BusinessUnit>) {
    return await queryBuilder.getMany();
  }

  private applyPagination(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<BusinessUnit>,
  ) {
    queryBuilder
      .skip((criteria.page - 1) * criteria.limit)
      .take(criteria.limit);

    return this;
  }

  private applyOrder(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<BusinessUnit>,
    aliasQuery: string,
  ) {
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

  private applyFilters(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<BusinessUnit>,
    aliasQuery: string,
  ) {
    if (!criteria.hasFilters()) {
      return this;
    }

    const whereMethod =
      criteria.groupOperator === GroupOperator.AND ? 'andWhere' : 'orWhere';

    queryBuilder.where(
      new Brackets((qb) => {
        criteria.filters.forEach((filter) => {
          const fieldPath = filter.relationPath
            ? `${filter.relationPath}.${filter.field}`
            : `${aliasQuery}.${filter.field}`;

          const paramName = filter.field;

          switch (filter.operator) {
            case FilterOperators.EQUALS:
              qb[whereMethod](`${fieldPath} = :${paramName}`, {
                [paramName]: filter.value,
              });
              break;
            case FilterOperators.LIKE:
              qb[whereMethod](`LOWER(${fieldPath}) LIKE LOWER(:${paramName})`, {
                [paramName]: `%${filter.value}%`,
              });
              break;
          }
        });
      }),
    );

    return this;
  }

  async update(businessUnit: BusinessUnit): Promise<void> {
    await this.repository.save({
      id: businessUnit.id,
      name: businessUnit.name,
      code: businessUnit.code,
      country: businessUnit.country,
      isActive: businessUnit.isActive,
      examinationCenters: businessUnit.examinationCenters,
    });
  }

  async getAll(adminUserBusinessUnits: string[]): Promise<BusinessUnit[]> {
    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );

    return await this.repository.find({
      where: { id: In(adminUserBusinessUnits) },
    });
  }

  private filterUser(
    queryBuilder: SelectQueryBuilder<BusinessUnit>,
    adminUserBusinessUnits: string[],
    aliasQuery: string,
  ) {
    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );

    queryBuilder.andWhere(`${aliasQuery}.id IN(:...ids)`, {
      ids: adminUserBusinessUnits,
    });

    return this;
  }
}
