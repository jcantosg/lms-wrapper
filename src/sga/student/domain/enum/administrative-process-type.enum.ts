export enum AdministrativeProcessTypeEnum {
  NEW_ACADEMIC_RECORD = 'Nuevo expediente',
  PHOTO = 'Foto',
  IDENTITY_DOCUMENTS = 'Documento de indentidad',
  ACCESS_DOCUMENTS = 'Documento de acceso',
  ACADEMIC_RECOGNITION = 'Convalidación',
  RESIGNATION = 'Renuncia',
}

export const getAllAdministrativeProcessTypes =
  (): AdministrativeProcessTypeEnum[] =>
    Object.values(AdministrativeProcessTypeEnum);
