import { LmsStudent } from '#/lms-wrapper/domain/entity/lms-student';

export abstract class LmsStudentRepository {
  abstract save(
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<LmsStudent>;

  abstract delete(id: number): Promise<void>;
}
