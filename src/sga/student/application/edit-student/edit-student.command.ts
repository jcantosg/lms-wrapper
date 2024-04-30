import { Command } from '#shared/domain/bus/command';
import { StudentGender } from '#student/domain/enum/student-gender.enum';
import { IdentityDocumentValues } from '#/sga/shared/domain/value-object/identity-document';
import { AccessQualification } from '#student/domain/enum/access-qualification.enum';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class EditStudentCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly surname: string,
    public readonly surname2: string,
    public readonly email: string,
    public readonly universaeEmail: string,
    public readonly isActive: boolean,
    public readonly adminUser: AdminUser,
    public readonly avatar: string | null,
    public readonly birthDate: Date | null,
    public readonly gender: StudentGender | null,
    public readonly country: string | null,
    public readonly citizenship: string | null,
    public readonly identityDocument: IdentityDocumentValues | null,
    public readonly socialSecurityNumber: string | null,
    public readonly accessQualification: AccessQualification | null,
    public readonly niaIdalu: string | null,
    public readonly phone: string | null,
    public readonly contactCountry: string | null,
    public readonly state: string | null,
    public readonly city: string | null,
    public readonly address: string | null,
    public readonly guardianName: string | null,
    public readonly guardianSurname: string | null,
    public readonly guardianEmail: string | null,
    public readonly guardianPhone: string | null,
  ) {}
}
