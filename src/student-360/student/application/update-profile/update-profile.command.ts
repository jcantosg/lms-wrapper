import { Command } from '#shared/domain/bus/command';
import { StudentGender } from '#shared/domain/enum/student-gender.enum';

export class UpdateProfileCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly surname: string,
    public readonly surname2: string,
    public readonly email: string,
    public readonly newPassword: string | null,
    public readonly avatar: string | null,
    public readonly birthDate: Date | null,
    public readonly gender: StudentGender,
    public readonly country: string | null,
    public readonly citizenship: string | null,
    public readonly socialSecurityNumber: string | null,
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
