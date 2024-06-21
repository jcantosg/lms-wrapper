import { IdentityDocumentValues } from '#/sga/shared/domain/value-object/identity-document';
import { Student } from '#shared/domain/entity/student.entity';

interface GetStudentDetailResponse {
  id: string;
  name: string;
  surname: string;
  surname2: string;
  email: string;
  universaeEmail: string;
  avatar: string | null;
  birthDate: Date | null;
  gender: string | null;
  country: { id: string; name: string; emoji: string } | null;
  citizenship: { id: string; name: string; emoji: string } | null;
  identityDocument: IdentityDocumentValues | null;
  socialSecurityNumber: string | null;
  status: string;
  isActive: boolean;
  origin: string | null;
  crmID: string | null;
  accessQualification: string | null;
  niaIdalu: string | null;
  phone: string | null;
  contactCountry: { id: string; name: string; emoji: string } | null;
  state: string | null;
  city: string | null;
  address: string | null;
  guardianName: string | null;
  guardianSurname: string | null;
  guardianEmail: string | null;
  guardianPhone: string | null;
  leadId: string | null;
}

export class GetStudentResponse {
  static create(student: Student): GetStudentDetailResponse {
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
      identityDocument: student.identityDocument?.value ?? null,
      socialSecurityNumber: student.socialSecurityNumber,
      status: student.status,
      isActive: student.isActive,
      origin: student.origin,
      crmID: student.crmId,
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
      leadId: student.leadId,
    };
  }
}
