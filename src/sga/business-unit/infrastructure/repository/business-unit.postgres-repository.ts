import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';
import { FilterOperators } from '#/sga/shared/domain/criteria/filter';

@Injectable()
export class BusinessUnitPostgresRepository implements BusinessUnitRepository {
  constructor(
    @InjectRepository(businessUnitSchema)
    private readonly repository: Repository<BusinessUnit>,
  ) {}

  async save(businessUnit: BusinessUnit): Promise<void> {
    await this.repository.save(businessUnit);
  }

  async get(id: string): Promise<BusinessUnit | null> {
    return await this.repository.findOne({
      where: { id },
      relations: { country: true, virtualCampuses: true },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id } });

    return !!result;
  }

  async existsByName(name: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { name } });

    return !!result;
  }

  async existsByCode(code: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { code } });

    return !!result;
  }

  async count(criteria: Criteria): Promise<number> {
    const aliasQuery = 'businessUnit';
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    return this.applyFilters(criteria, queryBuilder, aliasQuery).getCount(
      queryBuilder,
    );
  }

  private async getCount(queryBuilder: SelectQueryBuilder<BusinessUnit>) {
    return await queryBuilder.getCount();
  }

  async matching(criteria: Criteria): Promise<BusinessUnit[]> {
    const aliasQuery = 'businessUnit';
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.country`, 'country');

    return this.applyFilters(criteria, queryBuilder, aliasQuery)
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
      queryBuilder.addOrderBy(
        `${aliasQuery}.${criteria.order.orderBy}`,
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

    criteria.filters.forEach((filter) => {
      if (filter.operator === FilterOperators.EQUALS) {
        queryBuilder.andWhere(
          `${aliasQuery}.${filter.field} = :${filter.field}`,
          {
            [filter.field]: filter.value,
          },
        );
      } else {
        queryBuilder.andWhere(
          `LOWER(${aliasQuery}.${filter.field}) LIKE LOWER(:${filter.field})`,
          {
            [filter.field]: `%${filter.value}%`,
          },
        );
      }
    });

    return this;
  }

  async update(businessUnit: BusinessUnit): Promise<void> {
    await this.repository.update(businessUnit.id, {
      name: businessUnit.name,
      code: businessUnit.code,
      isActive: businessUnit.isActive,
      updatedAt: businessUnit.updatedAt,
      updatedBy: businessUnit.updatedBy,
    });
  }
}
