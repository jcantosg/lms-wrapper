import { EdaeUser } from '#edae-user/domain/entity/edae-user.entity';

interface EdaeUserResponsePlain {
  id: string;
  name: string;
  surname1: string;
  surname2: string | null;
  avatar: string | null;
}
export class GetAllEdaeUsersPlainResponse {
  static create(edaeUsers: EdaeUser[]): EdaeUserResponsePlain[] {
    return edaeUsers.map((edaeUser) => ({
      id: edaeUser.id,
      name: edaeUser.name,
      surname1: edaeUser.surname1,
      surname2: edaeUser.surname2,
      avatar: edaeUser.avatar,
    }));
  }
}
