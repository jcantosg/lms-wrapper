import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { Injectable } from '@nestjs/common';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';
import { Brackets, Like, Repository, SelectQueryBuilder } from 'typeorm';
import { Criteria, GroupOperator } from '#/sga/shared/domain/criteria/criteria';
import { FilterOperators } from '#/sga/shared/domain/criteria/filter';
import { OrderTypes } from '#/sga/shared/domain/criteria/order';

@Injectable()
export class ExaminationCenterPostgresRepository
  implements ExaminationCenterRepository
{
  constructor(
    @InjectRepository(examinationCenterSchema)
    private repository: Repository<ExaminationCenter>,
  ) {}

  private normalizeAdminUserBusinessUnits(businessUnits: string[]) {
    if (businessUnits.length === 0) {
      businessUnits.push('empty');
    }

    return businessUnits;
  }

  async save(examinationCenter: ExaminationCenter): Promise<void> {
    await this.repository.save(examinationCenter);
  }

  async existsByCode(id: string, code: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { code } });

    return result === null ? false : result.id !== id;
  }

  async getNextAvailableCode(codePart: string): Promise<string> {
    const results = await this.repository.find({
      where: { code: Like(`${codePart}%`) },
    });

    const count = results.length;

    return `${codePart}${count > 9 ? '' + count : '0' + count}`;
  }

  async existsById(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id } });

    return !!result;
  }

  async existsByName(name: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { name } });

    return !!result;
  }

  async count(
    criteria: Criteria,
    adminUserBusinessUnits: string[],
  ): Promise<number> {
    const aliasQuery = 'examinationCenter';
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.country`, 'country');
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnits`,
      'businessUnits',
    );

    return this.applyFilters(criteria, queryBuilder, aliasQuery)
      .filterUser(queryBuilder, adminUserBusinessUnits, 'businessUnits')
      .getCount(queryBuilder);
  }

  private async getCount(queryBuilder: SelectQueryBuilder<ExaminationCenter>) {
    return await queryBuilder.getCount();
  }

  async matching(
    criteria: Criteria,
    adminUserBusinessUnits: string[],
  ): Promise<ExaminationCenter[]> {
    const aliasQuery = 'examinationCenter';
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.country`, 'country');
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnits`,
      'businessUnits',
    );

    return this.applyFilters(criteria, queryBuilder, aliasQuery)
      .filterUser(queryBuilder, adminUserBusinessUnits, 'businessUnits')
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .applyPagination(criteria, queryBuilder)
      .getMany(queryBuilder);
  }

  private async getMany(queryBuilder: SelectQueryBuilder<ExaminationCenter>) {
    return await queryBuilder.getMany();
  }

  private applyPagination(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<ExaminationCenter>,
  ) {
    queryBuilder
      .skip((criteria.page - 1) * criteria.limit)
      .take(criteria.limit);

    return this;
  }

  private applyOrder(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<ExaminationCenter>,
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
    queryBuilder: SelectQueryBuilder<ExaminationCenter>,
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

  async get(id: string): Promise<ExaminationCenter | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        businessUnits: true,
        classrooms: true,
        mainBusinessUnit: true,
      },
    });
  }

  async getByAdminUser(
    examinationCenterId: string,
    adminUserBusinessUnits: string[],
  ): Promise<ExaminationCenter | null> {
    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );
    const queryBuilder =
      this.repository.createQueryBuilder('examinationCenter');

    queryBuilder.leftJoinAndSelect(
      'examinationCenter.businessUnits',
      'businessUnit',
    );
    queryBuilder.leftJoinAndSelect('examinationCenter.classrooms', 'classroom');

    return await queryBuilder
      .where('examinationCenter.id = :id', { id: examinationCenterId })
      .andWhere('businessUnit.id IN(:...ids)', {
        ids: adminUserBusinessUnits,
      })
      .getOne();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  async update(examinationCenter: ExaminationCenter): Promise<void> {
    await this.repository.save({
      id: examinationCenter.id,
      name: examinationCenter.name,
      code: examinationCenter.code,
      address: examinationCenter.address,
      businessUnits: examinationCenter.businessUnits,
      isActive: examinationCenter.isActive,
      updatedBy: examinationCenter.updatedBy,
      updatedAt: examinationCenter.updatedAt,
    });
  }

  async getByBusinessUnit(
    businessUnitId: string,
  ): Promise<ExaminationCenter[]> {
    return await this.repository.find({
      relations: { businessUnits: true },
      where: {
        businessUnits: {
          id: businessUnitId,
        },
      },
    });
  }

  private filterUser(
    queryBuilder: SelectQueryBuilder<ExaminationCenter>,
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
