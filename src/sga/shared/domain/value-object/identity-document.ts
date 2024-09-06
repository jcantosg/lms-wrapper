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

export const nieRegex = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
export const dniRegex = /^\d{8}[a-zA-Z]$/;
const letters = 'TRWAGMYFPDXBNJZSQVHLCKET';

export function getIdentityDocumentType(
  documentNumber: string | null,
): IdentityDocumentType | null {
  if (documentNumber) {
    if (dniRegex.test(documentNumber)) {
      return IdentityDocumentType.DNI;
    } else if (nieRegex.test(documentNumber)) {
      return IdentityDocumentType.NIE;
    } else {
      return IdentityDocumentType.PASSPORT;
    }
  }

  return null;
}

export class IdentityDocument extends ValueObject<IdentityDocumentValues> {
  constructor(identityDocument: IdentityDocumentValues) {
    super(identityDocument);
    if (Object.keys(identityDocument).length !== 0) {
      this.checkValue(
        identityDocument.identityDocumentType,
        identityDocument.identityDocumentNumber,
      );
    }
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
