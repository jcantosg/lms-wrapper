import { Communication } from '#shared/domain/entity/communication.entity';

export class StudentCount {
  static countStudents(communication: Communication): number {
    let count = 0;

    if (communication.students && communication.students.length > 0) {
      count += communication.students.length;
    }

    if (
      communication.internalGroups &&
      communication.internalGroups.length > 0
    ) {
      for (const internalGroup of communication.internalGroups) {
        if (internalGroup.students && internalGroup.students.length > 0) {
          count += internalGroup.students.length;
        }
      }
    }

    return count;
  }
}
