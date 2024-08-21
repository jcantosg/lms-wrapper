import { Command } from '#shared/domain/bus/command';
import { File } from '#shared/domain/file-manager/file';
import { AdministrativeProcessTypeEnum } from '#student/domain/enum/administrative-process-type.enum';
import { Student } from '#shared/domain/entity/student.entity';

export class UploadAdministrativeProcessCommand implements Command {
  constructor(
    public readonly academicRecordId: string | null,
    public readonly type: AdministrativeProcessTypeEnum,
    public readonly files: File[],
    public readonly student: Student,
  ) {}
}
