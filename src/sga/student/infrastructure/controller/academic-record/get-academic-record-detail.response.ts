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
  academicPeriod: {
    id: string;
    name: string;
    code: string;
  };
  academicProgram: {
    id: string;
    name: string;
    code: string;
  };
  modality: AcademicRecordModalityEnum;
  isModular: boolean;
  status: AcademicRecordStatusEnum;
  block: number;
  leadId: string | null;
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
      academicPeriod: {
        id: record.academicPeriod.id,
        name: record.academicPeriod.name,
        code: record.academicPeriod.code,
      },
      academicProgram: {
        id: record.academicProgram.id,
        name: record.academicProgram.name,
        code: record.academicProgram.code,
      },
      modality: record.modality,
      isModular: record.isModular,
      status: record.status,
      block: record.academicPeriod.blocksNumber,
      leadId: record.leadId,
    };
  }
}
