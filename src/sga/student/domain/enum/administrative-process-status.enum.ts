export enum AdministrativeProcessStatusEnum {
  VALIDATED = 'Validado',
  PENDING_DOCUMENTS = 'Documentos pendientes',
}

export const getAlAdministrativeProcessStatus =
  (): AdministrativeProcessStatusEnum[] =>
    Object.values(AdministrativeProcessStatusEnum);
