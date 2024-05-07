import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';
import { formatDate } from '#shared/domain/service/date-formatter.service';

export interface PeriodBlockResponse {
  id: string;
  startDate: Date;
  endDate: Date;
}

export interface AcademicPeriodResponse {
  id: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  businessUnit: AcademicPeriodBusinessUnitResponse;
  periodBlocks: PeriodBlockResponse[];
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
      periodBlocks: academicPeriod.periodBlocks.map((pb) => ({
        id: pb.id,
        startDate: pb.startDate,
        endDate: pb.endDate,
      })),
      blocksNumber: academicPeriod.periodBlocks.length,
    };
  }
}
