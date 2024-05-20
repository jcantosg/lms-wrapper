import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';

interface StudentAcademicRecordResponse {
  id: string;
  title: string;
  academicProgram: string;
  academicPeriod: string;
  status: AcademicRecordStatusEnum;
}

export class GetStudentAcademicRecordResponse {
  static create(records: AcademicRecord[]): StudentAcademicRecordResponse[] {
    return records.map((record) => ({
      id: record.id,
      title: record.academicProgram.title.name,
      academicProgram: record.academicProgram.name,
      academicPeriod: record.academicPeriod.name,
      status: record.status,
    }));
  }
}
