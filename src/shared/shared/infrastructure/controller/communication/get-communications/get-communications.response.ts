import { CommunicationStatus } from '#shared/domain/enum/communication-status.enum';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';
import { CommunicationWithStudents } from '#shared/application/communication/get-communications/get-communications.handler';

export interface GetCommunicationsItem {
  id: string;
  subject: string | null;
  sentBy: {
    id: string;
    name: string;
    surname: string;
    surname2: string | null;
    avatar: string | null;
  } | null;
  businessUnits: {
    id: string;
    name: string;
  }[];
  createdAt: Date;
  sentAt: Date | null;
  studentCount: number;
  status: CommunicationStatus | null;
}

export class GetCommunicationsResponse {
  static create(
    communications: CommunicationWithStudents[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<GetCommunicationsItem> {
    return {
      items: communications.map((c: CommunicationWithStudents) => {
        return {
          id: c.communication.id,
          subject: c.communication.message
            ? c.communication.message.subject
            : '',
          sentBy: c.communication.sentBy
            ? {
                id: c.communication.sentBy.id,
                name: c.communication.sentBy.name,
                surname: c.communication.sentBy.surname,
                surname2: c.communication.sentBy.surname2,
                avatar: c.communication.sentBy.avatar,
              }
            : null,
          businessUnits: c.communication.businessUnits.map((businessUnit) => {
            return {
              id: businessUnit.id,
              name: businessUnit.name,
            };
          }),
          createdAt: c.communication.createdAt,
          sentAt: c.communication.sentAt,
          studentCount: c.students.length,
          status: c.communication.status,
        };
      }),
      pagination: {
        total: total,
        page: page,
        limit: limit,
      },
    };
  }
}
