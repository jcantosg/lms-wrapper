import { Communication } from '#shared/domain/entity/communication.entity';
import { CommunicationSchema } from '#shared/infrastructure/config/schema/communication.schema';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunicationRepository } from '#shared/domain/repository/communication.repository';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';

@Injectable()
export class CommunicationPostgresRepository
  extends TypeOrmRepository<Communication>
  implements CommunicationRepository
{
  constructor(
    @InjectRepository(CommunicationSchema)
    private readonly repository: Repository<Communication>,
  ) {
    super();
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  async save(communication: Communication): Promise<void> {
    await this.repository.save({
      id: communication.id,
      createdBy: communication.createdBy,
      updatedBy: communication.updatedBy,
      createdAt: communication.createdAt,
      businessUnits: communication.businessUnits,
      academicPeriods: communication.academicPeriods,
      academicPrograms: communication.academicPrograms,
      titles: communication.titles,
      internalGroups: communication.internalGroups,
      sendByEmail: communication.sendByEmail,
      publishOnBoard: communication.publishOnBoard,
      status: communication.status,
      message: communication.message,
      sentBy: communication.sentBy,
      sentAt: communication.sentAt,
      students: communication.students,
    });
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.repository.findOne({ where: { id } });

    return !!result;
  }

  async get(id: string): Promise<Communication | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        businessUnits: true,
        academicPeriods: true,
        academicPrograms: true,
        titles: true,
        internalGroups: true,
        students: true,
      },
    });
  }

  async count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number> {
    const aliasQuery = 'communication';
    const queryBuilder = this.initializeQueryBuilder(aliasQuery);

    const baseRepository = isSuperAdmin
      ? this
      : await this.filterBusinessUnits(
          queryBuilder,
          'oneToMany',
          adminUserBusinessUnits,
        );

    let criteriaToQueryBuilder =
      await baseRepository.convertCriteriaToQueryBuilder(
        criteria,
        queryBuilder,
        aliasQuery,
      );

    if (criteria.page !== null && criteria.limit !== null) {
      criteriaToQueryBuilder = criteriaToQueryBuilder.applyPagination(
        criteria,
        queryBuilder,
      );
    }

    if (criteria.order !== null) {
      criteriaToQueryBuilder.applyOrder(criteria, queryBuilder, aliasQuery);
    }

    return await this.getCount(queryBuilder);
  }

  async matching(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<Communication[]> {
    const aliasQuery = 'communication';
    const queryBuilder = this.initializeQueryBuilder(aliasQuery);

    const baseRepository = isSuperAdmin
      ? this
      : await this.filterBusinessUnits(
          queryBuilder,
          'oneToMany',
          adminUserBusinessUnits,
        );

    let criteriaToQueryBuilder =
      await baseRepository.convertCriteriaToQueryBuilder(
        criteria,
        queryBuilder,
        aliasQuery,
      );

    if (criteria.page !== null && criteria.limit !== null) {
      criteriaToQueryBuilder = criteriaToQueryBuilder.applyPagination(
        criteria,
        queryBuilder,
      );
    }

    if (criteria.order !== null) {
      criteriaToQueryBuilder.applyOrder(criteria, queryBuilder, aliasQuery);
    }

    return await this.getMany(queryBuilder);
  }

  private initializeQueryBuilder(aliasQuery: string) {
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);
    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.businessUnits`,
      'businessUnit',
    );
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.students`, 'student');
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.sentBy`, 'sentBy');

    return queryBuilder;
  }
}
