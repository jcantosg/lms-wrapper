import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import { Repository } from 'typeorm';
import { classroomSchema } from '#business-unit/infrastructure/config/schema/classroom.schema';

@Injectable()
export class ClassroomPostgresRepository implements ClassroomRepository {
  constructor(
    @InjectRepository(classroomSchema)
    private repository: Repository<Classroom>,
  ) {}

  async get(id: string): Promise<Classroom | null> {
    return await this.repository.findOne({ where: { id } });
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

  async existsById(id: string): Promise<boolean> {
    const classroom = await this.repository.findOne({ where: { id } });

    return !!classroom;
  }
}
