import { AdministrativeProcessDocument } from '#student/domain/entity/administrative-process-document.entity';

export abstract class AdministrativeProcessDocumentRepository {
  abstract save(
    administrativeProcess: AdministrativeProcessDocument,
  ): Promise<void>;
  abstract get(id: string): Promise<AdministrativeProcessDocument | null>;
  abstract getLastIdentityDocumentsByStudent(
    studentId: string,
  ): Promise<AdministrativeProcessDocument | null>;
}
