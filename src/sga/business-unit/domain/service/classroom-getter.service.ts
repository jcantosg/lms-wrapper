import { ClassroomRepository } from '#business-unit/domain/repository/classroom.repository';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';
import { ClassroomNotFoundException } from '#shared/domain/exception/business-unit/classroom-not-found.exception';

export class ClassroomGetter {
  constructor(private repository: ClassroomRepository) {}

  async get(id: string): Promise<Classroom> {
    const classroom = await this.repository.get(id);
    if (!classroom) {
      throw new ClassroomNotFoundException();
    }

    return classroom;
  }
}
