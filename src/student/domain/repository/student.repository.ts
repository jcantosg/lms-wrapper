import { Student } from '#/student/domain/entity/student.entity';

export abstract class StudentRepository {
  abstract save(student: Student): Promise<void>;

  abstract existsById(id: string): Promise<boolean>;

  abstract existsByEmail(id: string, email: string): Promise<boolean>;

  abstract existsByUniversaeEmail(
    id: string,
    universaeEmail: string,
  ): Promise<boolean>;

  abstract get(id: string): Promise<Student | null>;
}
