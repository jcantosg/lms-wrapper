import { SubjectModality } from '#academic-offering/domain/enum/subject-modality.enum';
import { SubjectType } from '#academic-offering/domain/enum/subject-type.enum';

export class GetAllSubjectsE2eSeedDataConfig {
  static subjects = [
    {
      id: '9f090dcf-4622-4c47-874c-bf4f90cda039',
      imageUrl: null,
      name: 'Administración de sistemas gestores de bases de datos',
      code: 'MAD-INAS08',
      officialCode: '01234',
      hours: 900,
      modality: SubjectModality.ELEARNING,
      evaluationType: '8adeb962-3669-4c37-ada0-01328ef74c00',
      type: SubjectType.SUBJECT,
      businessUnit: 'Madrid',
      isRegulated: true,
      isCore: true,
      officialRegionalCode: 'MAD',
    },
    {
      id: 'a7f3274f-b3b1-4c6f-8448-437ad613ba4b',
      imageUrl: null,
      name: 'Formación y Orientación Laboral',
      code: 'MU-TCLPI05',
      officialCode: null,
      hours: 800,
      modality: SubjectModality.PRESENCIAL,
      evaluationType: '8adeb962-3669-4c37-ada0-01328ef74c00',
      type: SubjectType.SUBJECT,
      businessUnit: 'Murcia',
      isRegulated: true,
      isCore: true,
      officialRegionalCode: 'MUR',
    },
    {
      id: '1facba7c-486d-4b63-acfb-a1f2ac00fe3f',
      imageUrl: null,
      name: 'Proyecto de administración de sistemas informáticos en red',
      code: 'MAD-INAS10',
      officialCode: null,
      hours: 300,
      modality: SubjectModality.ELEARNING,
      evaluationType: '3f61b94e-dcef-4f78-a96f-128a6aaf71fd',
      type: SubjectType.TFG,
      businessUnit: 'Madrid',
      isRegulated: true,
      isCore: true,
      officialRegionalCode: 'MAD',
    },
  ];
}
