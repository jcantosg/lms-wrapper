import { CommunicationStudent } from '#shared/domain/entity/communicarion-student.entity';

export interface GetStudentCommunicationsItem {
  id: string;
  message: {
    body: string;
    subject: string;
    shortDescription: string;
  };
  sentAt: Date;
  isRead: boolean;
  sentBy: {
    id: string;
    name: string;
    surname: string;
    avatar: string | null;
  };
}

export class GetStudentCommunicationsResponse {
  static create(
    communications: CommunicationStudent[],
  ): GetStudentCommunicationsItem[] {
    return communications.map((com) => ({
      id: com.communication.id,
      message: {
        body: com.communication.message!.value.body,
        subject: com.communication.message!.value.subject,
        shortDescription: com.communication.message!.value.shortDescription,
      },
      sentAt: com.communication.sentAt ?? new Date(),
      isRead: com.isRead,
      sentBy: {
        id: com.communication.sentBy!.id,
        name: com.communication.sentBy!.name,
        surname: com.communication.sentBy!.surname,
        surname2: com.communication.sentBy!.surname2 ?? '',
        avatar: com.communication.sentBy!.avatar,
      },
    }));
  }
}
