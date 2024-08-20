import { StudentGender } from '#shared/domain/enum/student-gender.enum';
import { IdentityDocumentValues } from '#/sga/shared/domain/value-object/identity-document';
import { StudentStatus } from '#shared/domain/enum/student-status.enum';
import { StudentOrigin } from '#shared/domain/enum/student-origin.enum.';
import { AccessQualification } from '#shared/domain/enum/access-qualification.enum';
import { Student } from '#shared/domain/entity/student.entity';

interface StudentMeResponseBody {
  id: string;
  name: string;
  surname: string;
  surname2: string;
  email: string;
  universaeEmail: string;
  avatar: string | null;
  birthDate: Date | null;
  gender: StudentGender | null;
  country: {
    id: string;
    name: string;
    emoji: string;
  } | null;
  citizenship: {
    id: string;
    name: string;
    emoji: string;
  } | null;
  identityDocument: IdentityDocumentValues | null;
  socialSecurityNumber: string | null;
  status: StudentStatus | null;
  isActive: boolean;
  origin: StudentOrigin;
  crmId: string | null;
  accessQualification: AccessQualification | null;
  niaIdalu: string | null;
  phone: string | null;
  contactCountry: {
    id: string;
    name: string;
    emoji: string;
  } | null;
  state: string | null;
  city: string | null;
  address: string | null;
  guardianName: string | null;
  guardianSurname: string | null;
  guardianEmail: string | null;
  guardianPhone: string | null;
  isDefense: boolean;
  isAdult: boolean;
  hasAdministrativeProcessesPending: boolean;
}

export class StudentMeResponse {
  static create(
    student: Student,
    hasAdministrativeProcessesPending: boolean,
  ): StudentMeResponseBody {
    return {
      id: student.id,
      name: student.name,
      surname: student.surname,
      surname2: student.surname2,
      email: student.email,
      universaeEmail: student.universaeEmail,
      avatar: student.avatar,
      birthDate: student.birthDate,
      gender: student.gender,
      country: student.country
        ? {
            id: student.country.id,
            name: student.country.name,
            emoji: student.country.emoji,
          }
        : null,
      citizenship: student.citizenship
        ? {
            id: student.citizenship.id,
            name: student.citizenship.name,
            emoji: student.citizenship.emoji,
          }
        : null,
      identityDocument: student.identityDocument
        ? student.identityDocument.value
        : null,
      socialSecurityNumber: student.socialSecurityNumber,
      status: student.status,
      isActive: student.isActive,
      origin: student.origin,
      crmId: student.crmId,
      accessQualification: student.accessQualification,
      niaIdalu: student.niaIdalu,
      phone: student.phone,
      contactCountry: student.contactCountry
        ? {
            id: student.contactCountry.id,
            name: student.contactCountry.name,
            emoji: student.contactCountry.emoji,
          }
        : null,
      state: student.state,
      city: student.city,
      address: student.address,
      guardianName: student.guardianName,
      guardianSurname: student.guardianSurname,
      guardianEmail: student.guardianEmail,
      guardianPhone: student.guardianPhone,
      isDefense: student.isDefense,
      isAdult: student.isAdult(),
      hasAdministrativeProcessesPending,
    };
  }
}
