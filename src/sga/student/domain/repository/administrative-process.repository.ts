import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { BusinessUnit } from '#business-unit/domain/entity/business-unit.entity';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';

export abstract class AdministrativeProcessRepository {
  abstract save(administrativeProcess: AdministrativeProcess): Promise<void>;
  abstract get(id: string): Promise<AdministrativeProcess | null>;
  abstract getByStudent(studentId: string): Promise<AdministrativeProcess[]>;
  abstract getByAcademicRecord(
    academicRecordId: string,
  ): Promise<AdministrativeProcess[]>;
  abstract count(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<number>;
  abstract matching(
    criteria: Criteria,
    adminUserBusinessUnits: BusinessUnit[],
    isSuperAdmin: boolean,
  ): Promise<AdministrativeProcess[]>;
  abstract saveBatch(
    administrativeProcesses: AdministrativeProcess[],
  ): Promise<void>;
}
