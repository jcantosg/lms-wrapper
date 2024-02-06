import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BusinessUnitRepository } from '#business-unit/domain/repository/business-unit.repository';
import { businessUnitSchema } from '#business-unit/infrastructure/config/schema/business-unit.schema';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';

@Injectable()
export class BusinessUnitPostgresRepository
  extends TypeOrmRepository<BusinessUnit>
  implements BusinessUnitRepository
{
  constructor(
    @InjectRepository(businessUnitSchema)
    private readonly repository: Repository<BusinessUnit>,
  ) {
    super();
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
        examinationCenters: {
          classrooms: true,
        },
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

    return (
      await this.convertCriteriaToQueryBuilder(
        criteria,
        queryBuilder,
        aliasQuery,
      )
    )
      .filterUser(queryBuilder, adminUserBusinessUnits, aliasQuery)
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .applyPagination(criteria, queryBuilder)
      .getCount(queryBuilder);
  }

  async matching(
    criteria: Criteria,
    adminUserBusinessUnits: string[],
  ): Promise<BusinessUnit[]> {
    const aliasQuery = 'businessUnit';
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.country`, 'country');

    return (
      await this.convertCriteriaToQueryBuilder(
        criteria,
        queryBuilder,
        aliasQuery,
      )
    )
      .filterUser(queryBuilder, adminUserBusinessUnits, aliasQuery)
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .applyPagination(criteria, queryBuilder)
      .getMany(queryBuilder);
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
      where: { id: In(adminUserBusinessUnits), isActive: true },
    });
  }
}
