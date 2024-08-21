import { CommunicationStudent } from '#shared/domain/entity/communicarion-student.entity';

export abstract class CommunicationStudentRepository {
  abstract save(communicationStudent: CommunicationStudent): Promise<void>;
  abstract getByCommunication(
    communicationId: string,
  ): Promise<CommunicationStudent[]>;
  abstract getByStudent(studentId: string): Promise<CommunicationStudent[]>;
  abstract deleteByCommunication(communicationId: string): Promise<void>;
}
