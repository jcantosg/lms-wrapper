import {
  IdentityDocument,
  IdentityDocumentType,
} from '#/sga/shared/domain/value-object/identity-document';
import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';
import { LmsCourseCategoryEnum } from '#/lms-wrapper/domain/enum/lms-course-category.enum';
import { LmsStudent } from '#/lms-wrapper/domain/entity/lms-student';
import { LmsModuleContent } from '#/lms-wrapper/domain/entity/lms-module-content';

export const getAnIdentityDocument = (
  identityDocumentType: IdentityDocumentType = IdentityDocumentType.DNI,
  identityDocumentNumber: string = '91704030V',
): IdentityDocument =>
  new IdentityDocument({ identityDocumentType, identityDocumentNumber });

export const getALmsCourse = (id: number = Math.random(), name: string) =>
  new LmsCourse({
    id: id,
    categoryId: LmsCourseCategoryEnum.MIXTA,
    shortname: 'test',
    progress: 0,
    name: name,
    modules: [
      {
        id: 1,
        name: 'Test',
        image: 'image.jpeg',
        isVisible: true,
        officialTests: undefined,
        autoEvaluationTests: undefined,
      },
    ],
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

export const getALmsContentModule = (id: number = Math.random()) =>
  new LmsModuleContent({
    id: id,
    name: 'test',
    modules: [
      {
        id: id,
        name: 'test',
        url: 'url',
        type: 'content',
        isVisible: true,
        moduleType: 'resource',
        description: 'description',
        contents: [
          {
            id: id,
            name: 'test',
            url: 'url',
            mimeType: 'pdf',
            isCompleted: false,
          },
        ],
      },
    ],
  });
