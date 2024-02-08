import { ExaminationCenter } from '#business-unit/domain/entity/examination-center.entity';
import { Classroom } from '#business-unit/domain/entity/classroom.entity';

export interface BusinessUnitExaminationCenterResponse {
  id: string;
  code: string;
  name: string;
  classrooms: ClassroomResponse[];
}

export interface ClassroomResponse {
  id: string;
  name: string;
  code: string;
  capacity: number;
}

export class GetBusinessUnitExaminationCentersResponse {
  static create(
    examinationCenters: ExaminationCenter[],
  ): BusinessUnitExaminationCenterResponse[] {
    return examinationCenters.map((examinationCenter) => ({
      id: examinationCenter.id,
      code: examinationCenter.code,
      name: examinationCenter.name,
      classrooms: examinationCenter.classrooms.map((classroom: Classroom) => ({
        id: classroom.id,
        name: classroom.name,
        code: classroom.code,
        capacity: classroom.capacity,
      })),
    }));
  }
}
