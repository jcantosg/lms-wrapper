import { ApplicationEvent } from '#shared/domain/event/application.event';
import { Student } from '#shared/domain/entity/student.entity';

export class StudentPasswordUpdatedEvent implements ApplicationEvent {
  name: string = 'student-password-updated';

  constructor(
    public student: Student,
    public newPassword: string,
  ) {}
}
