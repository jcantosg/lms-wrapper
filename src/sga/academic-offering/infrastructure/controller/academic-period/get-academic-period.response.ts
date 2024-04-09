import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { formatDate } from '#shared/domain/service/date-formatter.service';

export interface ExaminationCallResponse {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  timeZone: TimeZoneEnum;
}

export interface AcademicPeriodResponse {
  id: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  businessUnit: AcademicPeriodBusinessUnitResponse;
  examinationCalls: ExaminationCallResponse[];
  blocksNumber: number;
}

export interface AcademicPeriodBusinessUnitResponse {
  id: string;
  name: string;
}

export class GetAcademicPeriodResponse {
  static create(academicPeriod: AcademicPeriod): AcademicPeriodResponse {
    return {
      id: academicPeriod.id,
      name: academicPeriod.name,
      code: academicPeriod.code,
      startDate: formatDate(academicPeriod.startDate),
      endDate: formatDate(academicPeriod.endDate),
      businessUnit: {
        id: academicPeriod.businessUnit.id,
        name: academicPeriod.businessUnit.name,
      },
      examinationCalls: academicPeriod.examinationCalls.map((ec) => ({
        id: ec.id,
        name: ec.name,
        startDate: formatDate(ec.startDate),
        endDate: formatDate(ec.endDate),
        timeZone: ec.timezone,
      })),
      blocksNumber: academicPeriod.blocksNumber,
    };
  }
}
