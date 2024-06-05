import { Command } from '#shared/domain/bus/command';
import { SubjectCallFinalGradeEnum } from '#student/domain/enum/enrollment/subject-call-final-grade.enum';
import { MonthEnum } from '#/sga/shared/domain/enum/month.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class EditSubjectCallCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly month: MonthEnum,
    public readonly year: number,
    public readonly finalGrade: SubjectCallFinalGradeEnum,
    public readonly adminUser: AdminUser,
  ) {}
}
