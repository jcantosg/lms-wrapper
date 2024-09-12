import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { formatDate } from '#shared/domain/service/date-formatter.service';
import { AcademicRecord } from '#student/domain/entity/academic-record.entity';

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
  administrativeProcessDocuments: AdministrativeProcessDocumentResponse | null;
  academicRecognition: AdministrativeProcessDocumentResponse | null;
  resignation: AdministrativeProcessDocumentResponse | null;
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

    const academicRecords = administrativeProcesses
      .map((ap) => ap.academicRecord)
      .filter((ac) => ac && ac !== null)
      .reduce((accumulator: AcademicRecord[], current: AcademicRecord) => {
        if (!accumulator.find((ap) => ap.id === current.id)) {
          accumulator.push(current);
        }

        return accumulator;
      }, []);

    const access = administrativeProcesses.filter(
      (ap) => ap.type === AdministrativeProcessTypeEnum.ACCESS_DOCUMENTS,
    );
    const academicRecognitions = administrativeProcesses.filter(
      (ap) => ap.type === AdministrativeProcessTypeEnum.ACADEMIC_RECOGNITION,
    );
    const resignations = administrativeProcesses.filter(
      (ap) => ap.type === AdministrativeProcessTypeEnum.RESIGNATION,
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
      accessDocuments: academicRecords.map((academicRecord) => {
        const accessDocument = access.find(
          (ad) => ad.academicRecord!.id === academicRecord!.id,
        );
        const ar = academicRecognitions.find(
          (ar) => ar.academicRecord!.id === academicRecord!.id,
        );
        const resignation = resignations.find(
          (resignation) =>
            resignation.academicRecord!.id === academicRecord!.id,
        );

        return {
          titleName: academicRecord!.academicProgram.title.name,
          administrativeProcessDocuments: accessDocument
            ? {
                id: accessDocument.id,
                createdAt: formatDate(accessDocument.createdAt),
                updatedAt: formatDate(accessDocument.updatedAt),
                status: accessDocument.status,
                files: accessDocument.files.map((file) => ({
                  url: file.value.url,
                  name: file.value.name,
                  size: `${file.value.size}MB`,
                })),
              }
            : null,
          academicRecognition: ar
            ? {
                id: ar.id,
                createdAt: formatDate(ar.createdAt),
                updatedAt: formatDate(ar.updatedAt),
                status: ar.status,
                files: ar.files.map((file) => ({
                  url: file.value.url,
                  name: file.value.name,
                  size: `${file.value.size}MB`,
                })),
              }
            : null,
          resignation: resignation
            ? {
                id: resignation.id,
                createdAt: formatDate(resignation.createdAt),
                updatedAt: formatDate(resignation.updatedAt),
                status: resignation.status,
                files: resignation.files.map((file) => ({
                  url: file.value.url,
                  name: file.value.name,
                  size: `${file.value.size}MB`,
                })),
              }
            : null,
        };
      }),
    };
  }
}
