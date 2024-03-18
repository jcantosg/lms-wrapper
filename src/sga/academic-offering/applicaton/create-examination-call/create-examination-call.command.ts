import { TimeZoneEnum } from '#/sga/shared/domain/enum/time-zone.enum';
import { Command } from '#shared/domain/bus/command';

export class CreateExaminationCallCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly timezone: TimeZoneEnum,
    public readonly academicPeriodId: string,
    public readonly adminUserBusinessUnits: string[],
  ) {}
}
