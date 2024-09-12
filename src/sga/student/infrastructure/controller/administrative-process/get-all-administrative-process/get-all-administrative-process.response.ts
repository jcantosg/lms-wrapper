import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { AdministrativeProcessStatusEnum } from '#student/domain/enum/administrative-process-status.enum';
import { AdministrativeProcess } from '#student/domain/entity/administrative-process.entity';

export interface GetAdministrativeProcessResponse {
  id: string;
  student: {
    id: string;
    name: string;
    surname: string;
    surname2: string | undefined;
    avatar: string | null;
    email: string;
  };
  businessUnit: {
    id: string | null;
    name: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
  type: AdministrativeProcessTypeEnum;
  status: AdministrativeProcessStatusEnum;
}

export class GetAllAdministrativeProcessesResponse {
  static create(
    administrativeProcesses: AdministrativeProcess[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<GetAdministrativeProcessResponse> {
    return {
      pagination: {
        total: total,
        page: page,
        limit: limit,
      },
      items: administrativeProcesses.map(
        (
          administrativeProcess: AdministrativeProcess,
        ): GetAdministrativeProcessResponse => {
          return {
            id: administrativeProcess.id,
            student: {
              id: administrativeProcess.student
                ? administrativeProcess.student.id
                : administrativeProcess.academicRecord!.student.id,
              name: administrativeProcess.student
                ? administrativeProcess.student.name
                : administrativeProcess.academicRecord!.student.name,
              surname: administrativeProcess.student
                ? administrativeProcess.student.surname
                : administrativeProcess.academicRecord!.student.surname,
              surname2: administrativeProcess.student
                ? administrativeProcess.student.surname2
                : administrativeProcess.academicRecord!.student.surname2,
              avatar: administrativeProcess.student
                ? administrativeProcess.student.avatar
                : administrativeProcess.academicRecord!.student.avatar,
              email: administrativeProcess.student
                ? administrativeProcess.student.email
                : administrativeProcess.academicRecord!.student.email,
            },
            businessUnit: {
              id: administrativeProcess.businessUnit
                ? administrativeProcess.businessUnit.id
                : '',
              name: administrativeProcess.businessUnit
                ? administrativeProcess.businessUnit.name
                : '',
            },
            createdAt: administrativeProcess.createdAt,
            updatedAt: administrativeProcess.updatedAt,
            type: administrativeProcess.type,
            status: administrativeProcess.status,
          };
        },
      ),
    };
  }
}
