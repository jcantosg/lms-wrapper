import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';

interface StudentAcademicRecordResponse {
  id: string;
  title: string;
  academicProgram: {
    id: string;
    name: string;
    code: string;
  };
  academicPeriod: {
    id: string;
    name: string;
    code: string;
  };
  status: AcademicRecordStatusEnum;
}

export class GetStudentAcademicRecordResponse {
  static create(records: AcademicRecord[]): StudentAcademicRecordResponse[] {
    return records.map((record) => ({
      id: record.id,
      title: record.academicProgram.title.name,
      academicProgram: {
        id: record.academicProgram.id,
        name: record.academicProgram.name,
        code: record.academicProgram.code,
      },
      academicPeriod: {
        id: record.academicPeriod.id,
        name: record.academicPeriod.name,
        code: record.academicPeriod.code,
      },
      status: record.status,
    }));
  }
}
