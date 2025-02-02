import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import { Repository } from 'typeorm';
import { classroomSchema } from '#business-unit/infrastructure/config/schema/classroom.schema';
import { TypeOrmRepository } from '#/sga/shared/infrastructure/repository/type-orm-repository';

@Injectable()
export class ClassroomPostgresRepository
  extends TypeOrmRepository<Classroom>
  implements ClassroomRepository
{
  constructor(
    @InjectRepository(classroomSchema)
    private repository: Repository<Classroom>,
  ) {
    super();
  }

  async get(id: string): Promise<Classroom | null> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        examinationCenter: { businessUnits: true },
      },
    });
  }

  async save(classroom: Classroom): Promise<void> {
    await this.repository.save(classroom);
  }

  async existsByNameAndExaminationCenter(
    id: string,
    name: string,
    examinationCenterId: string,
  ): Promise<boolean> {
    const classroom = await this.repository.findOne({
      where: {
        name: name,
        examinationCenter: {
          id: examinationCenterId,
        },
      },
    });

    return !classroom ? false : classroom.id !== id;
  }

  async existsByCode(id: string, code: string): Promise<boolean> {
    const classroom = await this.repository.findOne({ where: { code } });

    return !classroom ? false : classroom.id !== id;
  }

  async update(classroom: Classroom): Promise<void> {
    await this.repository.update(classroom.id, {
      name: classroom.name,
      code: classroom.code,
      capacity: classroom.capacity,
      updatedAt: classroom.updatedAt,
      updatedBy: classroom.updatedBy,
      isActive: classroom.isActive,
      examinationCenter: classroom.examinationCenter,
    });
  }

  async existsById(id: string): Promise<boolean> {
    const classroom = await this.repository.findOne({ where: { id } });

    return !!classroom;
  }

  async delete(classroom: Classroom): Promise<void> {
    await this.repository.delete(classroom.id);
  }
}
