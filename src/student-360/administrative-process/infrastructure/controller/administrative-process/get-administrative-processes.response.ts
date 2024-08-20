import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';

export interface AdministrativeProcessFileBody {
  url: string;
  name: string;
  size: number;
  mymeType: string;
}

export interface AdministrativeProcessResponseBody {
  identityDocument: {
    id: string;
    status: AdministrativeProcessStatusEnum;
    files: AdministrativeProcessFileBody[];
  } | null;
  photo: {
    id: string;
    status: AdministrativeProcessStatusEnum;
    files: AdministrativeProcessFileBody[];
  } | null;
  academicRecords: {
    id: string;
    titleName: string;
    accessDocumentation: {
      id: string;
      status: AdministrativeProcessStatusEnum;
      files: AdministrativeProcessFileBody[];
    } | null;
  }[];
}

export class GetAllStudentAdministrativeProcessesResponse {
  static create(
    administrativeProcesses: AdministrativeProcess[],
  ): AdministrativeProcessResponseBody {
    const identityDocumentProcess = administrativeProcesses.find(
      (ap) => ap.type === AdministrativeProcessTypeEnum.IDENTITY_DOCUMENTS,
    );
    const photoProcess = administrativeProcesses.find(
      (ap) => ap.type === AdministrativeProcessTypeEnum.PHOTO,
    );
    const academicRecordProcesses = administrativeProcesses.filter(
      (ap) => ap.type === AdministrativeProcessTypeEnum.NEW_ACADEMIC_RECORD,
    );
    const accessDocumentProcesses = administrativeProcesses.filter(
      (ap) => ap.type === AdministrativeProcessTypeEnum.ACCESS_DOCUMENTS,
    );

    return {
      identityDocument: identityDocumentProcess
        ? {
            id: identityDocumentProcess.id,
            status: identityDocumentProcess.status,
            files: identityDocumentProcess.files.map((file) => ({
              url: file.value.url,
              name: file.value.name,
              size: file.value.size,
              mymeType: file.value.mimeType,
            })),
          }
        : null,
      photo: photoProcess
        ? {
            id: photoProcess.id,
            status: photoProcess.status,
            files: photoProcess.files.map((file) => ({
              url: file.value.url,
              name: file.value.name,
              size: file.value.size,
              mymeType: file.value.mimeType,
            })),
          }
        : null,
      academicRecords: academicRecordProcesses.map((ap) => {
        const documentation = accessDocumentProcesses.find(
          (ad) => ad.academicRecord!.id === ap.academicRecord!.id,
        );

        return {
          id: ap.id,
          titleName: ap.academicRecord?.academicProgram.title.name ?? '',
          accessDocumentation: documentation
            ? {
                id: documentation.id,
                status: documentation.status,
                files: documentation.files.map((file) => ({
                  url: file.value.url,
                  name: file.value.name,
                  size: file.value.size,
                  mymeType: file.value.mimeType,
                })),
              }
            : null,
        };
      }),
    };
  }
}
