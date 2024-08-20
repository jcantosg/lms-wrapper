import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { formatDate } from '#shared/domain/service/date-formatter.service';

export interface AdministrativeProcessDocumentResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: AdministrativeProcessStatusEnum;
  files: {
    url: string;
    name: string;
    size: string;
  }[];
}

export interface AdministrativeProcessAccessDocumentResponse {
  titleName: string;
  administrativeProcessDocuments: AdministrativeProcessDocumentResponse;
}

export interface StudentAdministrativeProcessDocumentsResponse {
  photoDocument: AdministrativeProcessDocumentResponse | null;
  identityDocument: AdministrativeProcessDocumentResponse | null;
  accessDocuments: AdministrativeProcessAccessDocumentResponse[];
}

export class GetStudentAdministrativeProcessDocumentsResponse {
  static create(
    administrativeProcesses: AdministrativeProcess[],
  ): StudentAdministrativeProcessDocumentsResponse {
    const photo =
      administrativeProcesses.find(
        (ap) => ap.type === AdministrativeProcessTypeEnum.PHOTO,
      ) ?? null;
    const identity =
      administrativeProcesses.find(
        (ap) => ap.type === AdministrativeProcessTypeEnum.IDENTITY_DOCUMENTS,
      ) ?? null;

    const access = administrativeProcesses.filter(
      (ap) => ap.type === AdministrativeProcessTypeEnum.ACCESS_DOCUMENTS,
    );

    return {
      photoDocument: photo
        ? {
            id: photo.id,
            createdAt: formatDate(photo.createdAt),
            updatedAt: formatDate(photo.updatedAt),
            status: photo.status,
            files: photo.files.map((file) => ({
              url: file.value.url,
              name: file.value.name,
              size: `${file.value.size}MB`,
            })),
          }
        : photo,
      identityDocument: identity
        ? {
            id: identity.id,
            createdAt: formatDate(identity.createdAt),
            updatedAt: formatDate(identity.updatedAt),
            status: identity.status,
            files: identity.files.map((file) => ({
              url: file.value.url,
              name: file.value.name,
              size: `${file.value.size}MB`,
            })),
          }
        : identity,
      accessDocuments: access.map((ac) => ({
        titleName: ac.academicRecord!.academicProgram.title.name,
        administrativeProcessDocuments: {
          id: ac.id,
          createdAt: formatDate(ac.createdAt),
          updatedAt: formatDate(ac.updatedAt),
          status: ac.status,
          files: ac.files.map((file) => ({
            url: file.value.url,
            name: file.value.name,
            size: `${file.value.size}MB`,
          })),
        },
      })),
    };
  }
}
