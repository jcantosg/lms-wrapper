import { InvalidIdentityDocumentException } from '#shared/domain/exception/admin-user/invalid-identity-document.exception';
import { ValueObject } from '#/sga/shared/domain/value-object/value-object';

export enum IdentityDocumentType {
  DNI = 'dni',
  PASSPORT = 'passport',
  NIE = 'nie',
}

export function getIdentityDocumentTypes(): string[] {
  return Object.values(IdentityDocumentType);
}

export type IdentityDocumentValues = {
  identityDocumentType: IdentityDocumentType;
  identityDocumentNumber: string;
};

const dniRegex = /^\d{8}[a-zA-Z]$/;
const letters = 'TRWAGMYFPDXBNJZSQVHLCKET';

export class IdentityDocument extends ValueObject<IdentityDocumentValues> {
  constructor(identityDocument: IdentityDocumentValues) {
    super(identityDocument);
    this.checkValue(
      identityDocument.identityDocumentType,
      identityDocument.identityDocumentNumber,
    );
  }

  public get identityDocumentType(): string {
    return this.value.identityDocumentType;
  }

  public get identityDocumentNumber(): string {
    return this.value.identityDocumentNumber;
  }

  private checkValue(
    identityDocumentType: string,
    identityDocumentNumber: string,
  ) {
    this.checkIdentityDocumentType(identityDocumentType);
    this.checkIdentityDocumentNumber(
      identityDocumentType,
      identityDocumentNumber,
    );
  }

  private checkIdentityDocumentNumber(
    identityDocumentType: string,
    identityDocumentNumber: string,
  ) {
    if (identityDocumentType === IdentityDocumentType.DNI) {
      if (!dniRegex.test(identityDocumentNumber)) {
        throw new InvalidIdentityDocumentException();
      }
      let identityNumber = Number.parseInt(
        identityDocumentNumber.substring(0, identityDocumentNumber.length - 1),
      );
      const letter = identityDocumentNumber.substring(
        identityDocumentNumber.length - 1,
        identityDocumentNumber.length,
      );
      identityNumber = identityNumber % 23;
      const assignedLetter = letters.substring(
        identityNumber,
        identityNumber + 1,
      );
      if (assignedLetter != letter.toUpperCase()) {
        throw new InvalidIdentityDocumentException();
      }
    }
  }

  private checkIdentityDocumentType(identityDocumentType: string) {
    if (
      !Object.values(IdentityDocumentType).includes(
        identityDocumentType as IdentityDocumentType,
      )
    ) {
      throw new InvalidIdentityDocumentException();
    }
  }
}