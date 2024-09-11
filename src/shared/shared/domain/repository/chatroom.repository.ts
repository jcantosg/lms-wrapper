import { Chatroom } from '#shared/domain/entity/chatroom.entity';
import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

export abstract class ChatroomRepository {
  abstract save(chatroom: Chatroom): Promise<void>;
  abstract saveBatch(chatrooms: Chatroom[]): Promise<void>;
  abstract getByStudent(studentId: string): Promise<Chatroom[]>;
  abstract getByEdaeUserAndFBIds(
    edaeUser: EdaeUser,
    fbChatrommIds: string[],
  ): Promise<Chatroom[]>;
  abstract existsByStudentAndTeacherAndInternalGroup(
    studentId: string,
    teacherId: string,
    internalGroupId: string,
  ): Promise<boolean>;
  abstract get(id: string): Promise<Chatroom | null>;
  abstract matching(criteria: Criteria): Promise<Chatroom[]>;
}
