import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { CommunicationStudent } from '#shared/domain/entity/communicarion-student.entity';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { CommunicationStudentSchema } from '#shared/infrastructure/config/schema/communication-student.schema';
import { CommunicationStatus } from '#shared/domain/enum/communication-status.enum';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';

@Injectable()
export class CommunicationStudentPostgresRepository
  extends TypeOrmRepository<CommunicationStudent>
  implements CommunicationStudentRepository
{
  constructor(
    @InjectRepository(CommunicationStudentSchema)
    private readonly repository: Repository<CommunicationStudent>,
  ) {
    super();
  }

  async getByCommunication(
    communicationId: string,
  ): Promise<CommunicationStudent[]> {
    return await this.repository.find({
      where: { communication: { id: communicationId } },
      relations: { communication: true, student: true },
    });
  }

  async getByCommunicationAndStudent(
    communicationId: string,
    studentId: string,
  ): Promise<CommunicationStudent | null> {
    return await this.repository.findOne({
      where: {
        communication: { id: communicationId },
        student: { id: studentId },
        isDeleted: false,
      },
      relations: { communication: true, student: true },
    });
  }

  async countUnread(studentId: string): Promise<number> {
    return await this.repository.count({
      where: {
        student: { id: studentId },
        isDeleted: false,
        isRead: false,
        communication: { status: CommunicationStatus.SENT },
      },
    });
  }

  async getByStudent(studentId: string): Promise<CommunicationStudent[]> {
    return await this.repository.find({
      where: {
        student: { id: studentId },
        isDeleted: false,
        communication: { status: CommunicationStatus.SENT },
      },
      relations: { communication: { sentBy: true }, student: true },
      order: { communication: { sentAt: 'DESC' } },
    });
  }

  async deleteByCommunication(communicationId: string): Promise<void> {
    await this.repository.delete({ communication: { id: communicationId } });
  }

  async save(communicationStudent: CommunicationStudent): Promise<void> {
    await this.repository.save({
      id: communicationStudent.id,
      communication: communicationStudent.communication,
      createdAt: communicationStudent.createdAt,
      isDeleted: communicationStudent.isDeleted,
      isRead: communicationStudent.isRead,
      student: communicationStudent.student,
      updatedAt: communicationStudent.updatedAt,
    });
  }

  private initializeQueryBuilder(aliasQuery: string) {
    const queryBuilder = this.repository.createQueryBuilder(aliasQuery);

    queryBuilder.leftJoinAndSelect(
      `${aliasQuery}.communication`,
      'communication',
    );
    queryBuilder.leftJoinAndSelect(`communication.sentBy`, 'sent_by');
    queryBuilder.leftJoinAndSelect(`${aliasQuery}.student`, 'student');

    return queryBuilder;
  }

  async matching(criteria: Criteria): Promise<CommunicationStudent[]> {
    const aliasQuery = 'communicationStudent';
    const queryBuilder = this.initializeQueryBuilder(aliasQuery);

    const result = await this.convertCriteriaToQueryBuilder(
      criteria,
      queryBuilder,
      aliasQuery,
    );

    return result
      .applyOrder(criteria, queryBuilder, aliasQuery)
      .getMany(queryBuilder);
  }
}
