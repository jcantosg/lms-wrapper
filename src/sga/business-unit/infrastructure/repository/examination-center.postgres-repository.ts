import { ExaminationCenterRepository } from '#business-unit/domain/repository/examination-center.repository';
import { Injectable } from '@nestjs/common';
import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { examinationCenterSchema } from '#business-unit/infrastructure/config/schema/examination-center.schema';
import { Like, Repository } from 'typeorm';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';

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

  async existsByName(name: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { name } });

    return !!result;
  }

  async count(criteria: Criteria): Promise<number> {
    const aliasQuery = 'examinationCenter';
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.country`, 'country');
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnits`,
      'businessUnits',
    );

    return await (
      await this.convertCriteriaToQueryBuilder(
        null,
        criteria,
        queryBuilder,
        aliasQuery,
        'businessUnits',
      )
    ).getCount(queryBuilder);
  }

  async matching(criteria: Criteria): Promise<ExaminationCenter[]> {
    const aliasQuery = 'examinationCenter';
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.country`, 'country');
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnits`,
      'businessUnits',
    );

    return await (
      await this.convertCriteriaToQueryBuilder(
        null,
        criteria,
        queryBuilder,
        aliasQuery,
        'businessUnits',
      )
    ).getMany(queryBuilder);
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
      relations: { businessUnits: true, classrooms: true },
      where: {
        businessUnits: {
          id: businessUnitId,
        },
      },
    });
  }

  async getAll(): Promise<ExaminationCenter[]> {
    return await this.repository.find();
  }
}
