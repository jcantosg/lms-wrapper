import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { Subject } from '#academic-offering/domain/entity/subject.entity';
import { SubjectRepository } from '#academic-offering/domain/repository/subject.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { subjectSchema } from '#academic-offering/infrastructure/config/schema/subject.schema';
import { Repository } from 'typeorm';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';

export class SubjectPostgresRepository
  extends TypeOrmRepository<Subject>
  implements SubjectRepository
{
  constructor(
    @InjectRepository(subjectSchema)
    private readonly repository: Repository<Subject>,
  ) {
    super();
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id } });

    return !!result;
  }

  async existsByCode(id: string, code: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { code } });

    return !result ? false : result.id !== id;
  }

  async save(subject: Subject): Promise<void> {
    await this.repository.save({
      id: subject.id,
      name: subject.name,
      code: subject.code,
      officialCode: subject.officialCode,
      hours: subject.hours,
      modality: subject.modality,
      evaluationType: subject.evaluationType,
      type: subject.type,
      businessUnit: subject.businessUnit,
      teachers: subject.teachers,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
      createdBy: subject.createdBy,
      updatedBy: subject.updatedBy,
      isRegulated: subject.isRegulated,
      isCore: subject.isCore,
      image: subject.image,
    });
  }

  async get(id: string): Promise<Subject | null> {
    return await this.repository.findOne({
      where: { id },
      relations: { businessUnit: true, evaluationType: true, teachers: true },
    });
  }

  private initializeQueryBuilder(aliasQuery: string) {
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnit`,
      'business_unit',
    );

    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.evaluationType`,
      'evaluation_type',
    );

    queryBuilder.leftJoinAndSelect(`${aliasQuery}.teachers`, 'teachers');

    return queryBuilder;
  }

  async getByAdminUser(
    subjectId: string,
    adminUserBusinessUnits: string[],
    isSuperAdmin: boolean,
  ): Promise<Subject | null> {
    if (isSuperAdmin) {
      return await this.get(subjectId);
    }

    adminUserBusinessUnits = this.normalizeAdminUserBusinessUnits(
      adminUserBusinessUnits,
    );
    const queryBuilder = this.initializeQueryBuilder('subject');

    return await queryBuilder
      .where('subject.id = :id', { id: subjectId })
      .andWhere('business_unit.id IN(:...ids)', {
        ids: adminUserBusinessUnits,
      })
      .getOne();
  }

  async count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number> {
    const aliasQuery = 'subjects';
    const queryBuilder = this.initializeQueryBuilder(aliasQuery);

    const baseRepository = isSuperAdmin
      ? this
      : await this.filterBusinessUnits(
          queryBuilder,
          'oneToMany',
          adminUserBusinessUnits,
        );

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
  ): Promise<Subject[]> {
    const aliasQuery = 'subjects';
    const queryBuilder = this.initializeQueryBuilder(aliasQuery);

    const baseRepository = isSuperAdmin
      ? this
      : await this.filterBusinessUnits(
          queryBuilder,
          'oneToMany',
          adminUserBusinessUnits,
        );

    return await (
      await baseRepository.convertCriteriaToQueryBuilder(
        criteria,
        queryBuilder,
        aliasQuery,
      )
    )
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .applyPagination(criteria, queryBuilder)
      .getMany(queryBuilder);
  }
}
