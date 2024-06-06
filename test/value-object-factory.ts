import {
  IdentityDocument,
  IdentityDocumentType,
} from '#/sga/shared/domain/value-object/identity-document';
import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';
import { LmsCourseCategoryEnum } from '#/lms-wrapper/domain/enum/lms-course-category.enum';

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
