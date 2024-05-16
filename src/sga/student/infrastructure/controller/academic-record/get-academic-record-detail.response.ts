import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';

interface AcademicRecordDetailResponse {
  id: string;
  title: string;
  businessUnit: string;
  student: {
    id: string;
    name: string;
    surname: string;
    avatar: string | null;
    isActive: boolean;
  };
  academicPeriod: string;
  academicProgram: string;
  modality: AcademicRecordModalityEnum;
  isModular: boolean;
  status: AcademicRecordStatusEnum;
  block: number;
}

export class GetAcademicRecordDetailResponse {
  static create(record: AcademicRecord): AcademicRecordDetailResponse {
    return {
      id: record.id,
      title: record.academicProgram.title.name,
      businessUnit: record.businessUnit.name,
      student: {
        id: record.student.id,
        name: record.student.name,
        surname: record.student.surname,
        avatar: record.student.avatar,
        isActive: record.student.isActive,
      },
      academicPeriod: record.academicPeriod.name,
      academicProgram: record.academicProgram.name,
      modality: record.modality,
      isModular: record.isModular,
      status: record.status,
      block: record.academicPeriod.blocksNumber,
    };
  }
}
