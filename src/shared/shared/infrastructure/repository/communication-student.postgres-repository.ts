import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { CommunicationStudent } from '#shared/domain/entity/communicarion-student.entity';
import { CommunicationStudentRepository } from '#shared/domain/repository/communication-student.repository';
import { CommunicationStudentSchema } from '#shared/infrastructure/config/schema/communication-student.schema';

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
}
