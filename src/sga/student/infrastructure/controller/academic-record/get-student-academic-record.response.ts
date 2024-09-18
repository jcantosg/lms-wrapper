import { AcademicRecord } from '#student/domain/entity/academic-record.entity';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { AcademicRecordStatusEnum } from '#student/domain/enum/academic-record-status.enum';
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';

export interface AcademicRecordProcess {
  record: AcademicRecord;
  administrativeProcess: AdministrativeProcess | null;
}

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
  administrativeProcessStatus: AdministrativeProcessStatusEnum;
  status: AcademicRecordStatusEnum;
}

export class GetStudentAcademicRecordResponse {
  static create(
    academicRecords: AcademicRecordProcess[],
  ): StudentAcademicRecordResponse[] {
    return academicRecords.map((ar) => ({
      id: ar.record.id,
      title: ar.record.academicProgram.title.name,
      academicProgram: {
        id: ar.record.academicProgram.id,
        name: ar.record.academicProgram.name,
        code: ar.record.academicProgram.code,
      },
      academicPeriod: {
        id: ar.record.academicPeriod.id,
        name: ar.record.academicPeriod.name,
        code: ar.record.academicPeriod.code,
      },
      businessUnit: {
        id: ar.record.businessUnit.id,
        name: ar.record.businessUnit.name,
        code: ar.record.businessUnit.code,
      },
      virtualCampus: {
        id: ar.record.virtualCampus.id,
        name: ar.record.virtualCampus.name,
        code: ar.record.virtualCampus.code,
      },
      status: ar.record.status,
      administrativeProcessStatus: ar.administrativeProcess
        ? ar.administrativeProcess.status
        : AdministrativeProcessStatusEnum.PENDING_DOCUMENTS,
    }));
  }
}
