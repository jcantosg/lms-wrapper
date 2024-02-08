import {
  IdentityDocument,
  IdentityDocumentType,
} from '#/sga/shared/domain/value-object/identity-document';

export const getAnIdentityDocument = (
  identityDocumentType: IdentityDocumentType = IdentityDocumentType.DNI,
  identityDocumentNumber: string = '91704030V',
): IdentityDocument =>
  new IdentityDocument({ identityDocumentType, identityDocumentNumber });
