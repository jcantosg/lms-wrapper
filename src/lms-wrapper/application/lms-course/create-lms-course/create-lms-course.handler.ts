import { CommandHandler } from '#shared/domain/bus/command.handler';
import { LmsCourseRepository } from '#/lms-wrapper/domain/repository/lms-course.repository';
import { CreateLmsCourseCommand } from '#/lms-wrapper/application/lms-course/create-lms-course/create-lms-course.command';
import { LmsCourse } from '#/lms-wrapper/domain/entity/lms-course';

export class CreateLmsCourseHandler implements CommandHandler {
  constructor(private readonly repository: LmsCourseRepository) {}

  async handle(command: CreateLmsCourseCommand): Promise<void> {
    const lmsCourse = new LmsCourse({
      id: 1,
      name: command.name,
      categoryId: command.categoryId,
      shortname: command.shortName,
      modules: [],
    });
    await this.repository.save(lmsCourse);
  }
}
