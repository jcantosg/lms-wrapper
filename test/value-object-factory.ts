import {
  IdentityDocument,
  IdentityDocumentType,
} from '#/sga/shared/domain/value-object/identity-document';
import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';
import { LmsCourseCategoryEnum } from '#/lms-wrapper/domain/enum/lms-course-category.enum';
import { LmsStudent } from '#/lms-wrapper/domain/entity/lms-student';

export const getAnIdentityDocument = (
  identityDocumentType: IdentityDocumentType = IdentityDocumentType.DNI,
  identityDocumentNumber: string = '91704030V',
): IdentityDocument =>
  new IdentityDocument({ identityDocumentType, identityDocumentNumber });

export const getALmsCourse = (id: number = Math.random(), name: string) =>
  new LmsCourse({
    id: id,
    categoryId: LmsCourseCategoryEnum.MIXED,
    shortname: 'test',
    name: name,
    modules: [],
  });

export const getALmsStudent = (id: number = Math.random()) =>
  new LmsStudent({
    id: id,
    username: 'username',
    firstName: 'name',
    lastName: 'last name',
    email: 'email@test.com',
    password: 'password',
  });
