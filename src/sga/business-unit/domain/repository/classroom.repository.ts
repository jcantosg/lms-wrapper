import { Classroom } from '#business-unit/domain/entity/classroom.entity';

export abstract class ClassroomRepository {
  public abstract get(id: string): Promise<Classroom | null>;

  public abstract save(classroom: Classroom): Promise<void>;

  public abstract existsByNameAndExaminationCenter(
    id: string,
    name: string,
    examinationCenterId: string,
  ): Promise<boolean>;

  public abstract existsByCode(id: string, code: string): Promise<boolean>;
}
