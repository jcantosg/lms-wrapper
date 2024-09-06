import { Criteria } from '#/sga/shared/domain/criteria/criteria';
import { CommunicationStudent } from '#shared/domain/entity/communicarion-student.entity';

export abstract class CommunicationStudentRepository {
  abstract save(communicationStudent: CommunicationStudent): Promise<void>;
  abstract getByCommunication(
    communicationId: string,
  ): Promise<CommunicationStudent[]>;
  abstract getByCommunicationAndStudent(
    communicationId: string,
    studentId: string,
  ): Promise<CommunicationStudent | null>;
  abstract getByStudent(studentId: string): Promise<CommunicationStudent[]>;
  abstract countUnread(studentId: string): Promise<number>;
  abstract deleteByCommunication(communicationId: string): Promise<void>;
  abstract matching(criteria: Criteria): Promise<CommunicationStudent[]>;
}
