import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';

export interface ExaminationCenterResponse {
  name: string;
  code: string;
  isMain: boolean;
  classrooms: ClassroomResponse[];
}

export interface ClassroomResponse {
  id: string;
  name: string;
  code: string;
  capacity: number;
}

export class GetExaminationCenterResponse {
  static create(
    examinationCenter: ExaminationCenter,
    businessUnitId: string,
  ): ExaminationCenterResponse {
    return {
      name: examinationCenter.name,
      code: examinationCenter.code,
      isMain: examinationCenter.isMainForBusinessUnit(businessUnitId),
      classrooms: examinationCenter.classrooms.map(
        (classroom: Classroom): ClassroomResponse => ({
          id: classroom.id,
          name: classroom.name,
          code: classroom.code,
          capacity: classroom.capacity,
        }),
      ),
    };
  }
}
