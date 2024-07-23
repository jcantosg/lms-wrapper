export enum AdministrativeProcessDocumentsStatusEnum {
  REJECTED = 'Rechazado',
  DOCUMENT_VALIDATED = 'Validado',
  PENDING_VALIDATION = 'Pendiente de validación',
}

export const getAlAdministrativeProcessDocumentsStatus =
  (): AdministrativeProcessDocumentsStatusEnum[] =>
    Object.values(AdministrativeProcessDocumentsStatusEnum);
