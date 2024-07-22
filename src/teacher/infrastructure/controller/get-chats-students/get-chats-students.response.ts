import { Chatroom } from '#shared/domain/entity/chatroom.entity';

export interface GetChatStudentResponseBody {
  id: string;
  chatroomId: string | null;
  teacher: {
    id: string;
    name: string;
    surname1: string;
    avatar: string | null;
  };
  student: {
    id: string;
    name: string;
    surname: string;
    avatar: string | null;
  };
  subject: {
    id: string;
    name: string;
    code: string;
  };
  internalGroup: {
    id: string;
  };
}

export class GetChatsStudentsResponse {
  static create(chatroom: Chatroom[]): GetChatStudentResponseBody[] {
    return chatroom.map((chatroom) => ({
      id: chatroom.id,
      chatroomId: chatroom.chatroomId,
      teacher: {
        id: chatroom.teacher.id,
        name: chatroom.teacher.name,
        surname1: chatroom.teacher.surname1,
        avatar: chatroom.teacher.avatar,
      },
      student: {
        id: chatroom.student.id,
        name: chatroom.student.name,
        surname: chatroom.student.surname,
        avatar: chatroom.student.avatar,
      },
      subject: {
        id: chatroom.internalGroup.subject.id,
        name: chatroom.internalGroup.subject.name,
        code: chatroom.internalGroup.subject.code,
      },
      internalGroup: {
        id: chatroom.internalGroup.id,
      },
    }));
  }
}
