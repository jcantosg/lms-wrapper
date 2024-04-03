import { Command } from '#shared/domain/bus/command';
import { File } from '#shared/domain/file-manager/file';
import { AdminUser } from '#admin-user/domain/entity/admin-user.entity';

export interface ResourceFile {
  id: string;
  file: File;
}

export class UploadSubjectResourceCommand implements Command {
  constructor(
    public readonly resourceFiles: ResourceFile[],
    public readonly subjectId: string,
    public readonly adminUser: AdminUser,
  ) {}
}
