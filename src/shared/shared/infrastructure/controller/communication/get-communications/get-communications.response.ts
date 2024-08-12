import { CommunicationStatus } from '#shared/domain/enum/communication-status.enum';
import { Communication } from '#shared/domain/entity/communication.entity';
import { CollectionResponse } from '#/sga/shared/infrastructure/controller/collection.response';

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
    communications: Communication[],
    page: number,
    limit: number,
    total: number,
  ): CollectionResponse<GetCommunicationsItem> {
    return {
      items: communications.map((communication: Communication) => {
        return {
          id: communication.id,
          subject: communication.subject,
          sentBy: communication.sentBy
            ? {
                id: communication.sentBy.id,
                name: communication.sentBy.name,
                surname: communication.sentBy.surname,
                surname2: communication.sentBy.surname2,
                avatar: communication.sentBy.avatar,
              }
            : null,
          businessUnits: communication.businessUnits.map((businessUnit) => {
            return {
              id: businessUnit.id,
              name: businessUnit.name,
            };
          }),
          createdAt: communication.createdAt,
          sentAt: communication.sentAt,
          studentCount: communication.students.length,
          status: communication.status,
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
