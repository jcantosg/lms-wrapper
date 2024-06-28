import { AcademicRecord } from '#student/domain/entity/academic-record.entity';

interface GetStudentAcademicRecordsResponseItem {
  id: string;
  name: string;
}

export class GetStudentAcademicRecordsResponse {
  static create(
    academicRecords: AcademicRecord[],
  ): GetStudentAcademicRecordsResponseItem[] {
    return academicRecords.map((academicRecord: AcademicRecord) => {
      return {
        id: academicRecord.id,
        name: academicRecord.academicProgram.title.name,
      };
    });
  }
}
