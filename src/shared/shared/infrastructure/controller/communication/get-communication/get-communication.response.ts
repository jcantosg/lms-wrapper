import { CommunicationDetail } from '#shared/application/communication/search-communications/search-communications.handler';
import { CommunicationStatus } from '#shared/domain/enum/communication-status.enum';

export interface GetCommunication {
  id: string;
  sentAt: Date | null;
  businessUnits: {
    id: string;
    name: string;
  }[];
  academicPeriods: {
    id: string;
    name: string;
    code: string;
  }[];
  titles: {
    id: string;
    name: string;
  }[];
  academicPrograms: {
    id: string;
    name: string;
    code: string;
  }[];
  internalGroups: {
    id: string;
    code: string;
  }[];
  students: {
    id: string;
    name: string;
    surname: string;
    surname2: string | null;
    avatar: string | null;
  }[];
  message: {
    subject: string;
    shortDescription: string;
    body: string;
  } | null;
  sendByEmail: boolean;
  publishOnBoard: boolean;
  status: CommunicationStatus;
  studentCount: number;
}

export class GetCommunicationResponse {
  static create(c: CommunicationDetail): GetCommunication {
    return {
      id: c.communication.id,
      sentAt: c.communication.sentAt,
      businessUnits: c.communication.businessUnits.map((bu) => ({
        id: bu.id,
        name: bu.name,
      })),
      academicPeriods: c.communication.academicPeriods.map((ap) => ({
        id: ap.id,
        name: ap.name,
        code: ap.code,
      })),
      titles: c.communication.titles.map((title) => ({
        id: title.id,
        name: title.name,
      })),
      academicPrograms: c.communication.academicPrograms.map((ap) => ({
        id: ap.id,
        name: ap.name,
        code: ap.code,
      })),
      internalGroups: c.communication.internalGroups.map((ig) => ({
        id: ig.id,
        code: ig.code,
      })),
      students: c.communication.students.map((s) => ({
        id: s.id,
        name: s.name,
        surname: s.surname,
        surname2: s.surname2,
        avatar: s.avatar,
      })),
      message: c.communication.message
        ? {
            subject: c.communication.message.subject,
            shortDescription: c.communication.message.shortDescription,
            body: c.communication.message.body,
          }
        : null,
      sendByEmail: c.communication.sendByEmail ?? false,
      publishOnBoard: c.communication.publishOnBoard ?? false,
      status: c.communication.status ?? CommunicationStatus.DRAFT,
      studentCount: c.count,
    };
  }
}
