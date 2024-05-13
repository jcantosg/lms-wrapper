import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { internalGroupSchema } from '#student/infrastructure/config/schema/internal-group.schema';
import { InternalGroup } from '#student/domain/entity/internal-group-entity';
import { InternalGroupRepository } from '#student/domain/repository/internal-group.repository';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { AcademicProgram } from '#academic-offering/domain/entity/academic-program.entity';
import { Subject } from '#academic-offering/domain/entity/subject.entity';

export class InternalGroupPostgresRepository
  extends TypeOrmRepository<InternalGroup>
  implements InternalGroupRepository
{
  constructor(
    @InjectRepository(internalGroupSchema)
    private repository: Repository<InternalGroup>,
  ) {
    super();
  }

  async save(internalGroup: InternalGroup): Promise<void> {
    await this.repository.save({
      id: internalGroup.id,
      academicPeriod: internalGroup.academicPeriod,
      academicProgram: internalGroup.academicProgram,
      businessUnit: internalGroup.businessUnit,
      code: internalGroup.code,
      createdAt: internalGroup.createdAt,
      isDefault: internalGroup.isDefault,
      periodBlock: internalGroup.periodBlock,
      students: internalGroup.students,
      subject: internalGroup.subject,
      teachers: internalGroup.teachers,
      updatedAt: internalGroup.updatedAt,
      createdBy: internalGroup.createdBy,
      updatedBy: internalGroup.updatedBy,
    });
  }

  async saveBatch(internalGroups: InternalGroup[]): Promise<void> {
    await this.repository.save(
      internalGroups.map((internalGroup) => ({
        id: internalGroup.id,
        academicPeriod: internalGroup.academicPeriod,
        academicProgram: internalGroup.academicProgram,
        businessUnit: internalGroup.businessUnit,
        code: internalGroup.code,
        createdAt: internalGroup.createdAt,
        isDefault: internalGroup.isDefault,
        periodBlock: internalGroup.periodBlock,
        students: internalGroup.students,
        subject: internalGroup.subject,
        teachers: internalGroup.teachers,
        updatedAt: internalGroup.updatedAt,
        createdBy: internalGroup.createdBy,
        updatedBy: internalGroup.updatedBy,
      })),
    );
  }

  async get(id: string): Promise<InternalGroup | null> {
    return await this.repository.findOne({ where: { id: id } });
  }

  async getByKeys(
    academicPeriod: AcademicPeriod,
    academicProgram: AcademicProgram,
    subject: Subject,
  ): Promise<InternalGroup[]> {
    return await this.repository.find({
      where: {
        academicPeriod: { id: academicPeriod.id },
        academicProgram: { id: academicProgram.id },
        subject: { id: subject.id },
      },
    });
  }
}
