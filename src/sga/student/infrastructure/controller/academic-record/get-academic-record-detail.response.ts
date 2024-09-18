import { AcademicRecordModalityEnum } from '#student/domain/enum/academic-record-modality.enum';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AcademicRecordDetail } from '#student/application/academic-record/get-academic-record-detail/get-academic-record-detail.handler';

interface AcademicRecordDetailResponse {
  id: string;
  title: string;
  businessUnit: string;
  createdAt: Date;
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
  initialAcademicPeriod: {
    id: string;
    name: string;
    code: string;
  };
  academicProgram: {
    id: string;
    name: string;
    code: string;
  };
  administrativeGroup: {
    id: string;
    code: string;
  } | null;
  modality: AcademicRecordModalityEnum;
  isModular: boolean;
  status: AcademicRecordStatusEnum;
  block: number | null;
  leadId: string | null;
  totalHoursCompleted: number;
}

export class GetAcademicRecordDetailResponse {
  static create(record: AcademicRecordDetail): AcademicRecordDetailResponse {
    return {
      id: record.academicRecord.id,
      title: record.academicRecord.academicProgram.title.name,
      businessUnit: record.academicRecord.businessUnit.name,
      createdAt: record.academicRecord.createdAt,
      student: {
        id: record.academicRecord.student.id,
        name: record.academicRecord.student.name,
        surname: record.academicRecord.student.surname,
        avatar: record.academicRecord.student.avatar,
        isActive: record.academicRecord.student.isActive,
      },
      academicPeriod: {
        id: record.academicRecord.academicPeriod.id,
        name: record.academicRecord.academicPeriod.name,
        code: record.academicRecord.academicPeriod.code,
      },
      initialAcademicPeriod: {
        id: record.academicRecord.initialAcademicPeriod.id,
        name: record.academicRecord.initialAcademicPeriod.name,
        code: record.academicRecord.initialAcademicPeriod.code,
      },
      academicProgram: {
        id: record.academicRecord.academicProgram.id,
        name: record.academicRecord.academicProgram.name,
        code: record.academicRecord.academicProgram.code,
      },
      administrativeGroup: record.administrativeGroup
        ? {
            id: record.administrativeGroup.id,
            code: record.administrativeGroup.code,
          }
        : null,
      modality: record.academicRecord.modality,
      isModular: record.academicRecord.isModular,
      status: record.academicRecord.status,
      block: record?.administrativeGroup
        ? record.administrativeGroup.periodBlock.blockNumber()
        : null,
      leadId: record.academicRecord.leadId,
      totalHoursCompleted: record.totalHoursCompleted,
    };
  }
}
