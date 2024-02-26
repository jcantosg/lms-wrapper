import { AcademicPeriod } from '#academic-offering/domain/entity/academic-period.entity';

export interface AcademicPeriodResponse {
  id: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  businessUnit: AcademicPeriodBusinessUnitResponse;
}

export interface AcademicPeriodBusinessUnitResponse {
  id: string;
  name: string;
}

export class GetAcademicPeriodResponse {
  static create(academicPeriod: AcademicPeriod): AcademicPeriodResponse {
    const startDate: string = `${academicPeriod.startDate.getDate()}/${
      academicPeriod.startDate.getMonth() + 1
    }/${academicPeriod.startDate.getFullYear()}`;
    const endDate: string = `${academicPeriod.endDate.getDate()}/${
      academicPeriod.endDate.getMonth() + 1
    }/${academicPeriod.endDate.getFullYear()}`;

    return {
      id: academicPeriod.id,
      name: academicPeriod.name,
      code: academicPeriod.code,
      startDate,
      endDate,
      businessUnit: {
        id: academicPeriod.businessUnit.id,
        name: academicPeriod.businessUnit.name,
      },
    };
  }
}
