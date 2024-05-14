import { Command } from '#shared/domain/bus/command';
import { EnrollmentSubject } from '#student/application/enrollment/create-enrollment/enrollment-subject';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class CreateEnrollmentCommand implements Command {
  constructor(
    public readonly enrollmentSubjects: EnrollmentSubject[],
    public readonly academicRecordId: string,
    public readonly user: AdminUser,
  ) {}
}
