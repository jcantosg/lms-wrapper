import { Command } from '#shared/domain/bus/command';
import { File } from '#shared/domain/file-manager/file';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export class UploadSubjectResourceCommand implements Command {
  constructor(
    public readonly id: string,
    public readonly subjectId: string,
    public readonly files: File[],
    public readonly adminUser: AdminUser,
  ) {}
}
