import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { Injectable } from '@nestjs/common';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';
import { In, Like, Repository } from 'typeorm';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

@Injectable()
export class ExaminationCenterPostgresRepository
  extends TypeOrmRepository<ExaminationCenter>
  implements ExaminationCenterRepository
{
  constructor(
    @InjectRepository(examinationCenterSchema)
    private repository: Repository<ExaminationCenter>,
  ) {
    super();
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

  async existsByName(id: string, name: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { name } });

    return result === null ? false : result.name !== name;
  }

  private initializeQueryBuilder(aliasQuery: string) {
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.country`, 'country');
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnits`,
      'business_units',
    );
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.classrooms`, 'classrooms');

    return queryBuilder;
  }
  async count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number> {
    const aliasQuery = 'examinationCenter';
    const queryBuilder = this.initializeQueryBuilder(aliasQuery);

    const baseRepository = isSuperAdmin
      ? this
      : await this.filterBusinessUnits(queryBuilder, adminUserBusinessUnits);

    return await (
      await baseRepository.convertCriteriaToQueryBuilder(
        criteria,
        queryBuilder,
        aliasQuery,
      )
    )
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .applyPagination(criteria, queryBuilder)
      .getCount(queryBuilder);
  }

  async matching(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<ExaminationCenter[]> {
    const aliasQuery = 'examinationCenter';
    const queryBuilder = this.initializeQueryBuilder(aliasQuery);

    const baseRepository = isSuperAdmin
      ? this
      : await this.filterBusinessUnits(queryBuilder, adminUserBusinessUnits);

    const result = await (
      await baseRepository.convertCriteriaToQueryBuilder(
        criteria,
        queryBuilder,
        aliasQuery,
      )
    )
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .applyPagination(criteria, queryBuilder)
      .getMany(queryBuilder);

    return await this.cleanBusinessUnits(result, adminUserBusinessUnits);
  }

  private async cleanBusinessUnits(
    result: ExaminationCenter[],
    adminUserBusinessUnits: BusinessUnit[],
  ): Promise<ExaminationCenter[]> {
    const examinationCenters = await this.repository.find({
      where: { id: In(result.map((pre) => pre.id)) },
      relations: { businessUnits: true, country: true, classrooms: true },
    });

    examinationCenters.forEach((ec) => {
      ec.businessUnits = ec.businessUnits.filter((bu) =>
        adminUserBusinessUnits.find((adminBu) => adminBu.id === bu.id),
      );
    });

    return examinationCenters;
  }

  async get(id: string): Promise<ExaminationCenter | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        businessUnits: true,
        classrooms: true,
        mainBusinessUnit: true,
        country: true,
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
      country: examinationCenter.country,
    });
  }

  async getByBusinessUnit(
    businessUnitId: string,
  ): Promise<ExaminationCenter[]> {
    return await this.repository.find({
      relations: { businessUnits: true, classrooms: true },
      where: {
        businessUnits: {
          id: businessUnitId,
        },
      },
    });
  }

  async getAll(
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<ExaminationCenter[]> {
    if (isSuperAdmin) {
      return await this.repository.find();
    }

    const aliasQuery = 'examinationCenter';
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnits`,
      'business_units',
    );

    const baseRepository = await this.filterBusinessUnits(
      queryBuilder,
      adminUserBusinessUnits,
    );
    const result = await baseRepository.getMany(queryBuilder);

    return await this.cleanBusinessUnits(result, adminUserBusinessUnits);
  }
}
