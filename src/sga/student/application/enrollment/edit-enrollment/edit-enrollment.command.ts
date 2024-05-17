import { Command } from '#shared/domain/bus/command';
import { EnrollmentTypeEnum } from '#student/domain/enum/enrollment/enrollment-type.enum';
import { EnrollmentVisibilityEnum } from '#student/domain/enum/enrollment/enrollment-visibility.enum';

export class EditEnrollmentCommand implements Command {
  constructor(
    public readonly enrollmentId: string,
    public readonly type: EnrollmentTypeEnum,
    public readonly visibility: EnrollmentVisibilityEnum,
    public readonly maxCalls: number,
  ) {}
}
