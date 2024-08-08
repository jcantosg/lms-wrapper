export enum AdministrativeProcessStatusEnum {
  VALIDATED = 'Validado',
  PENDING_DOCUMENTS = 'Documentos pendientes',
  REJECTED = 'Rechazado',
  DOCUMENT_VALIDATED = 'Documento Validado',
  PENDING_VALIDATION = 'Pendiente de validación',
}

export const getAllAdministrativeProcessStatus =
  (): AdministrativeProcessStatusEnum[] =>
    Object.values(AdministrativeProcessStatusEnum);
