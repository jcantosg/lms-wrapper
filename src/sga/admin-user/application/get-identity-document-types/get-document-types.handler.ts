import { getIdentityDocumentTypes } from '#/sga/shared/domain/value-object/identity-document';

export class GetIdentityDocumentTypesHandler {
  handle(): string[] {
    return getIdentityDocumentTypes();
  }
}
